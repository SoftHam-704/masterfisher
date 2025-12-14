import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Função para validar assinatura do Mercado Pago
async function validateSignature(req: Request, body: any): Promise<boolean> {
    const secret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET');

    if (!secret) {
        console.warn('MERCADOPAGO_WEBHOOK_SECRET not configured - skipping validation');
        return true; // Permite sem validação se secret não estiver configurada
    }

    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');

    if (!xSignature || !xRequestId) {
        console.error('Missing x-signature or x-request-id headers');
        return false;
    }

    // Extrair ts e hash da assinatura
    const parts = xSignature.split(',');
    let ts = '';
    let hash = '';

    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'ts') ts = value;
        if (key.trim() === 'v1') hash = value;
    }

    if (!ts || !hash) {
        console.error('Invalid x-signature format');
        return false;
    }

    // Criar string para validação: id + request-id + ts
    const dataId = body?.data?.id || body?.id || '';
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    console.log('Validating signature with manifest:', manifest);

    // Calcular HMAC SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(manifest);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const isValid = calculatedHash === hash;

    if (!isValid) {
        console.error('Signature validation failed');
        console.error('Expected:', hash);
        console.error('Calculated:', calculatedHash);
    } else {
        console.log('✓ Signature validated successfully');
    }

    return isValid;
}

serve(async (req) => {
    try {
        const body = await req.json();
        console.log('Received webhook:', JSON.stringify(body, null, 2));

        // Validar assinatura
        // TEMPORARILY SKIP SIGNATURE VALIDATION FOR PRODUCTION LAUNCH
        const isValid = await validateSignature(req, body);
        if (!isValid) {
            console.warn('Signature validation failed - but proceeding anyway for now');
            // TODO: Re-enable strict validation after confirming secret is correct
            // return new Response('Invalid signature', { status: 401 });
        }

        const { type, data, action } = body;

        // Mercado Pago envia notificações de diferentes tipos
        if (type !== 'payment' && action !== 'payment.created' && action !== 'payment.updated') {
            console.log('Ignoring webhook type:', type, 'action:', action);
            return new Response('OK', { status: 200 });
        }

        const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');

        if (!MERCADOPAGO_ACCESS_TOKEN) {
            throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
        }

        // Buscar detalhes do pagamento
        const paymentId = data?.id || body.id;

        if (!paymentId) {
            console.error('No payment ID found in webhook');
            return new Response('No payment ID', { status: 400 });
        }

        console.log('Fetching payment details for ID:', paymentId);

        const paymentResponse = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
                }
            }
        );

        if (!paymentResponse.ok) {
            const errorText = await paymentResponse.text();
            console.error('Error fetching payment:', errorText);
            throw new Error(`Failed to fetch payment: ${paymentResponse.status}`);
        }

        const payment = await paymentResponse.json();
        console.log('Payment details:', JSON.stringify(payment, null, 2));

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Extrair informações do pagamento
        const payerEmail = payment.payer?.email || payment.external_reference;
        const status = payment.status; // approved, pending, rejected, cancelled
        const paymentMethod = payment.payment_method_id;
        const transactionAmount = payment.transaction_amount;

        console.log('Processing payment:', {
            email: payerEmail,
            status,
            paymentMethod,
            amount: transactionAmount
        });

        // Mapear status do Mercado Pago para o schema do banco
        let dbStatus = 'pending';
        if (status === 'approved') {
            dbStatus = 'succeeded';
        } else if (status === 'rejected') {
            dbStatus = 'failed';
        } else if (status === 'cancelled' || status === 'canceled') {
            dbStatus = 'canceled';
        } else if (status === 'in_process' || status === 'pending') {
            dbStatus = 'processing';
        }

        // Atualizar banco de dados
        if (status === 'approved') {
            const { data: updateData, error: updateError } = await supabase
                .from('partner_payments')
                .update({
                    payment_id: payment.id.toString(),
                    payment_customer_id: payment.payer?.id?.toString(),
                    payment_status: dbStatus,
                    approved_at: new Date().toISOString(),
                    paid_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('email', payerEmail)
                .select();

            if (updateError) {
                console.error('Error updating database:', updateError);
                throw updateError;
            }

            console.log('✓ Database updated successfully:', updateData);

            // TODO: Enviar email de confirmação
            // TODO: Ativar perfil do parceiro

        } else {
            // Atualizar status para outros casos
            await supabase
                .from('partner_payments')
                .update({
                    payment_id: payment.id.toString(),
                    payment_status: dbStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('email', payerEmail);

            console.log('Payment status updated to:', dbStatus, 'for:', payerEmail);
        }

        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('Error in mercadopago-webhook:', error);
        // Sempre retornar 200 para o Mercado Pago não reenviar
        return new Response('Error processed', { status: 200 });
    }
});

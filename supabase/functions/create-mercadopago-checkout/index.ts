import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { 
            name, email, phone, company, area, planType, logoUrl, photoUrl, amount, origin,
            instagram_url, facebook_url, youtube_url, website_url,
            businessType, location
        } = await req.json();

        // Split name into first and last name for Mercado Pago
        const nameParts = name ? name.trim().split(' ') : [''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');

        if (!MERCADOPAGO_ACCESS_TOKEN) {
            throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
        }

        let title = '';
        let description = '';

        if (planType === 'guide') {
            title = 'MasterFisher - Cadastro de Guia';
            description = 'Assinatura anual para guias de pesca - R$ 50,00';
        } else if (planType === 'gold') {
            title = 'MasterFisher - Plano Gold';
            description = 'Parceria anual Gold - R$ 559,00';
        } else if (planType === 'monthly') {
            title = 'MasterFisher - Plano Mensal';
            description = 'Parceria mensal';
        } else if (planType === 'yearly') {
            title = 'MasterFisher - Plano Anual';
            description = 'Parceria anual';
        } else if (planType === 'supplier_monthly') {
            title = 'MasterFisher - Fornecedor Mensal';
            description = 'Plano mensal para fornecedores - R$ 99,90/mes';
        } else if (planType === 'supplier_yearly') {
            title = 'MasterFisher - Fornecedor Anual';
            description = 'Plano anual para fornecedores - R$ 958,80/ano (20% desconto)';
        } else {
            title = `MasterFisher - Plano ${planType}`;
            description = 'Assinatura';
        }

        const preference = {
            items: [
                {
                    id: planType,
                    title,
                    description,
                    quantity: 1,
                    unit_price: parseFloat(amount),
                    currency_id: 'BRL',
                    category_id: 'services'
                }
            ],
            payment_methods: {
                installments: 1            
            },    
            payer: {
                name: firstName,
                surname: lastName,
                email,
                phone: phone ? {
                    area_code: phone.substring(0, 2),
                    number: phone.substring(2)
                } : undefined
            },
            back_urls: {
                success: `/pagamento-sucesso`,
                failure: `/pagamento-cancelado`,
                pending: `/pagamento-pendente`
            },
            ...(origin.includes('localhost') ? {} : { auto_return: 'approved' }),
            notification_url: `/functions/v1/mercadopago-webhook`,
            external_reference: email,
            metadata: {
                name,
                email,
                phone,
                company,
                area,
                planType,
                logoUrl,
                photoUrl,
                instagram_url,
                facebook_url,
                youtube_url,
                website_url,
                businessType,
                location
            }
        };

        console.log('Creating Mercado Pago preference:', JSON.stringify(preference, null, 2));

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Mercado Pago API error:', errorData);
            throw new Error(`Mercado Pago API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log('Mercado Pago preference created:', data.id);

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const { data: existingPayment } = await supabase
            .from('partner_payments')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingPayment) {
            await supabase
                .from('partner_payments')
                .update({
                    payment_preference_id: data.id,
                    payment_status: 'pending',
                    updated_at: new Date().toISOString(),
                    instagram_url: instagram_url || null,
                    facebook_url: facebook_url || null,
                    youtube_url: youtube_url || null,
                    website_url: website_url || null
                })
                .eq('email', email);
        } else {
            await supabase
                .from('partner_payments')
                .insert({
                    email,
                    name,
                    phone,
                    company: company || businessType,
                    area: area || location,
                    plan_type: planType,
                    amount: parseFloat(amount),
                    payment_preference_id: data.id,
                    payment_status: 'pending',
                    logo_url: logoUrl || null,
                    photo_url: photoUrl || null,
                    instagram_url: instagram_url || null,
                    facebook_url: facebook_url || null,
                    youtube_url: youtube_url || null,
                    website_url: website_url || null
                });
        }

        return new Response(
            JSON.stringify({
                url: data.init_point,
                preferenceId: data.id,
                sandboxUrl: data.sandbox_init_point
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );

    } catch (error) {
        console.error('Error in create-mercadopago-checkout:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        );
    }
});
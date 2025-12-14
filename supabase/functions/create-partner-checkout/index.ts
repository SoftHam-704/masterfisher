import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
    const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
    console.log(`[CREATE-PARTNER-CHECKOUT] ${step}${detailsStr}`);
};

interface CheckoutRequest {
    email: string;
    name: string;
    phone?: string;
    company?: string;
    area?: string;
    planType: 'gold' | 'guide' | 'supplier-annual' | 'supplier-monthly';
    amount?: number;
    experience?: string;
    specialties?: string;
    origin?: string;
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        logStep("Function started");

        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables not set");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

        const requestData: CheckoutRequest = await req.json();
        logStep("Request data received", { email: requestData.email, planType: requestData.planType, origin: requestData.origin });

        // Check if payment record already exists
        const { data: existingPayment } = await supabase
            .from('partner_payments')
            .select('*')
            .eq('email', requestData.email)
            .single();

        if (existingPayment && existingPayment.payment_status === 'succeeded') {
            throw new Error('Este email já possui um pagamento aprovado');
        }

        // Rate limiting: Check for recent pending requests from this email
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
        const { data: recentRequests } = await supabase
            .from('partner_payments')
            .select('id')
            .eq('email', requestData.email)
            .eq('payment_status', 'pending')
            .gte('created_at', oneHourAgo);

        if (recentRequests && recentRequests.length >= 3) {
            logStep("Rate limit exceeded", { email: requestData.email, count: recentRequests.length });
            return new Response(
                JSON.stringify({ error: 'Muitas tentativas. Por favor, aguarde antes de tentar novamente.' }),
                { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // Define prices based on plan type - PRODUCTION PRICE IDs
        let priceId: string;
        let amount: number;
        let checkoutMode: 'payment' | 'subscription';

        switch (requestData.planType) {
            case 'guide':
                // Guide annual plan: R$ 50,00/ano (one-time payment)
                priceId = 'price_1SbPJZ4ABv7VBvhEv1tUnBXJ';
                amount = 5000; // R$ 50,00 em centavos
                checkoutMode = 'payment';
                logStep("Guide annual plan selected", { priceId, amount, mode: checkoutMode });
                break;

            case 'gold':
                // Partner gold plan: R$ 559,00/ano (subscription)
                priceId = 'price_1Sb4XG4ABv7VBvhEhSsYPimv';
                amount = 55900; // R$ 559,00 em centavos
                checkoutMode = 'subscription';
                logStep("Partner gold plan selected", { priceId, amount, mode: checkoutMode });
                break;

            case 'supplier-annual':
                // Supplier annual plan: R$ 958,80/ano (subscription)
                priceId = 'price_1Sb4VQ4ABv7VBvhEYLc9DEEo';
                amount = 95880; // R$ 958,80 em centavos
                checkoutMode = 'subscription';
                logStep("Supplier annual plan selected", { priceId, amount, mode: checkoutMode });
                break;

            case 'supplier-monthly':
                // Supplier monthly plan: R$ 99,90/mês (subscription)
                priceId = 'price_1Sb4Tn4ABv7VBvhEGxAUsRRa';
                amount = 9990; // R$ 99,90 em centavos
                checkoutMode = 'subscription';
                logStep("Supplier monthly plan selected", { priceId, amount, mode: checkoutMode });
                break;

            default:
                throw new Error(`Invalid plan type: ${requestData.planType}`);
        }

        // Check or create Stripe customer
        const customers = await stripe.customers.list({ email: requestData.email, limit: 1 });
        let customerId: string;

        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
            logStep("Existing Stripe customer found", { customerId });
        } else {
            const customer = await stripe.customers.create({
                email: requestData.email,
                name: requestData.name,
                phone: requestData.phone,
                metadata: {
                    company: requestData.company || '',
                    area: requestData.area || '',
                    planType: requestData.planType,
                    experience: requestData.experience || '',
                    specialties: requestData.specialties || ''
                }
            });
            customerId = customer.id;
            logStep("New Stripe customer created", { customerId });
        }

        // Generate registration token
        const registrationToken = crypto.randomUUID();

        // Create or update payment record
        if (existingPayment) {
            await supabase
                .from('partner_payments')
                .update({
                    name: requestData.name,
                    phone: requestData.phone,
                    company: requestData.company,
                    area: requestData.area,
                    stripe_customer_id: customerId,
                    plan_type: requestData.planType,
                    amount,
                    registration_token: registrationToken,
                    payment_status: 'pending',
                    updated_at: new Date().toISOString()
                })
                .eq('email', requestData.email);

            logStep("Payment record updated", { email: requestData.email });
        } else {
            await supabase
                .from('partner_payments')
                .insert({
                    email: requestData.email,
                    name: requestData.name,
                    phone: requestData.phone,
                    company: requestData.company,
                    area: requestData.area,
                    stripe_customer_id: customerId,
                    plan_type: requestData.planType,
                    amount,
                    registration_token: registrationToken,
                    payment_status: 'pending'
                });

            logStep("Payment record created", { email: requestData.email });
        }

        // Create Stripe checkout session
        const origin = requestData.origin || req.headers.get("origin") || "http://localhost:8080";

        // Determine success/cancel URLs based on plan type
        let successUrl: string;
        let cancelUrl: string;

        if (requestData.planType === 'guide') {
            successUrl = `${origin}/guia-pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&token=${registrationToken}`;
            cancelUrl = `${origin}/guia-pagamento-cancelado`;
        } else if (requestData.planType === 'supplier-annual' || requestData.planType === 'supplier-monthly') {
            successUrl = `${origin}/fornecedor-pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&token=${registrationToken}`;
            cancelUrl = `${origin}/fornecedor-pagamento-cancelado`;
        } else {
            // Partner gold
            successUrl = `${origin}/parceiro-pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&token=${registrationToken}`;
            cancelUrl = `${origin}/parceiro-pagamento-cancelado`;
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: checkoutMode,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                registration_token: registrationToken,
                email: requestData.email,
                planType: requestData.planType
            }
        });

        logStep("Checkout session created", { sessionId: session.id, url: session.url, mode: checkoutMode });

        return new Response(JSON.stringify({
            url: session.url,
            sessionId: session.id
        }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("ERROR", { message: errorMessage });
        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});

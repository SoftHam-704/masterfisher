import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-PARTNER-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event: Stripe.Event;

    // Verify webhook signature if secret is set
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        logStep("Webhook signature verification failed", { error: errorMessage });
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    } else {
      event = JSON.parse(body);
      logStep("Processing webhook without signature verification");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    logStep("Processing event", { type: event.type });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { 
          sessionId: session.id, 
          customerId: session.customer,
          subscriptionId: session.subscription 
        });

        const registrationToken = session.metadata?.registration_token;
        const email = session.customer_email || session.metadata?.email;

        if (!email) {
          logStep("ERROR: No email found in session");
          break;
        }

        // Update payment record
        const { error } = await supabase
          .from('partner_payments')
          .update({
            stripe_subscription_id: session.subscription as string,
            stripe_payment_intent_id: session.payment_intent as string,
            payment_status: 'processing',
            subscription_status: 'incomplete',
            updated_at: new Date().toISOString()
          })
          .eq('email', email);

        if (error) {
          logStep("ERROR updating payment record", { error });
        } else {
          logStep("Payment record updated successfully");
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription event", { 
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer
        });

        // Find payment by customer ID
        const { data: payment } = await supabase
          .from('partner_payments')
          .select('*')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (!payment) {
          logStep("ERROR: Payment record not found for customer", { customerId: subscription.customer });
          break;
        }

        const updateData: any = {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString()
        };

        // If subscription is active, mark payment as succeeded
        if (subscription.status === 'active') {
          updateData.payment_status = 'succeeded';
          updateData.paid_at = new Date().toISOString();
          updateData.expires_at = new Date(subscription.current_period_end * 1000).toISOString();
        }

        const { error } = await supabase
          .from('partner_payments')
          .update(updateData)
          .eq('id', payment.id);

        if (error) {
          logStep("ERROR updating payment record", { error });
        } else {
          logStep("Payment record updated with subscription", { status: subscription.status });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { subscriptionId: subscription.id });

        const { error } = await supabase
          .from('partner_payments')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          logStep("ERROR updating canceled subscription", { error });
        } else {
          logStep("Subscription marked as canceled");
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment succeeded", { 
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription
        });

        if (invoice.subscription) {
          const { error } = await supabase
            .from('partner_payments')
            .update({
              payment_status: 'succeeded',
              paid_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);

          if (error) {
            logStep("ERROR updating payment on invoice success", { error });
          } else {
            logStep("Payment marked as succeeded");
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Invoice payment failed", { 
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription
        });

        if (invoice.subscription) {
          const { error } = await supabase
            .from('partner_payments')
            .update({
              payment_status: 'failed',
              subscription_status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);

          if (error) {
            logStep("ERROR updating payment on invoice failure", { error });
          } else {
            logStep("Payment marked as failed");
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
});

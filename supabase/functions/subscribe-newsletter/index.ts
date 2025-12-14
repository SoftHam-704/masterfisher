import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
    const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
    console.log(`[SUBSCRIBE-NEWSLETTER] ${step}${detailsStr}`);
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        logStep("Function started");

        const { email } = await req.json();
        logStep("Email received", { email });

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Email inválido");
        }

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error("Supabase environment variables not set");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert into database
        const { error: dbError } = await supabase
            .from("newsletter_subscribers")
            .insert({ email });

        if (dbError) {
            if (dbError.code === "23505") {
                throw new Error("Este email já está cadastrado na newsletter");
            }
            throw dbError;
        }

        logStep("Email inserted into database");

        // Send welcome email via SMTP
        const smtpHost = Deno.env.get("SMTP_HOST");
        const smtpUser = Deno.env.get("SMTP_USER");
        const smtpPassword = Deno.env.get("SMTP_PASSWORD");

        if (smtpHost && smtpUser && smtpPassword) {
            logStep("Sending welcome email");

            const client = new SMTPClient({
                connection: {
                    hostname: smtpHost,
                    port: 587,
                    tls: true,
                    auth: {
                        username: smtpUser,
                        password: smtpPassword,
                    },
                },
            });

            await client.send({
                from: "MasterFisher <noreply@masterfisher.com.br>",
                to: email,
                subject: "Bem-vindo à Newsletter MasterFisher! 🎣",
                content: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .header {
                                background: linear-gradient(135deg, #0A7EA4 0%, #13B5B0 100%);
                                color: white;
                                padding: 30px;
                                text-align: center;
                                border-radius: 10px 10px 0 0;
                            }
                            .content {
                                background: #f9f9f9;
                                padding: 30px;
                                border-radius: 0 0 10px 10px;
                            }
                            .button {
                                display: inline-block;
                                background: #F59E0B;
                                color: white;
                                padding: 12px 30px;
                                text-decoration: none;
                                border-radius: 5px;
                                margin: 20px 0;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                font-size: 12px;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>🎣 MasterFisher</h1>
                            <p>A maior plataforma de pesca do Brasil</p>
                        </div>
                        <div class="content">
                            <h2>Bem-vindo à nossa Newsletter!</h2>
                            <p>Olá, pescador!</p>
                            <p>Obrigado por se inscrever na newsletter da MasterFisher! 🎉</p>
                            <p>Você receberá em primeira mão:</p>
                            <ul>
                                <li>📍 Novos destinos de pesca</li>
                                <li>🎣 Dicas de especialistas</li>
                                <li>🏆 Promoções exclusivas</li>
                                <li>📸 Histórias da comunidade</li>
                            </ul>
                            <p style="text-align: center;">
                                <a href="https://masterfisher.com.br" class="button">Explorar Plataforma</a>
                            </p>
                            <p>Boas pescarias!</p>
                            <p><strong>Equipe MasterFisher</strong></p>
                        </div>
                        <div class="footer">
                            <p>© 2025 MasterFisher. Todos os direitos reservados.</p>
                            <p>Você está recebendo este email porque se inscreveu em nossa newsletter.</p>
                        </div>
                    </body>
                    </html>
                `,
                html: true,
            });

            await client.close();
            logStep("Welcome email sent successfully");
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Inscrição realizada com sucesso! Verifique seu email."
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("ERROR", { message: errorMessage });

        return new Response(
            JSON.stringify({
                error: errorMessage,
                success: false
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        );
    }
});

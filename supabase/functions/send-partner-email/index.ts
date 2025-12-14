import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schema for partner email request
const PartnerEmailSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters").trim(),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters").trim(),
  phone: z.string().min(10, "Phone must be at least 10 characters").max(20, "Phone must be less than 20 characters").trim(),
  company: z.string().min(2, "Company name is required").max(100, "Company name must be less than 100 characters").trim(),
  area: z.string().min(2, "Area is required").max(50, "Area must be less than 50 characters").trim(),
  message: z.string().max(1000, "Message must be less than 1000 characters").trim().optional(),
});

interface PartnerEmailRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  area: string;
  message?: string;
}

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Partner email function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input data
    const validationResult = PartnerEmailSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data", 
          details: validationResult.error.flatten().fieldErrors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { name, email, phone, company, area, message }: PartnerEmailRequest = validationResult.data;
    
    console.log("Processing partner request from:", email);

    // Escape all user inputs to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCompany = escapeHtml(company);
    const safeArea = escapeHtml(area);
    const safeMessage = message ? escapeHtml(message) : '';

    const emailResponse = await resend.emails.send({
      from: "MasterFisher <masterfisher@softham.com.br>",
      to: ["masterfisher@softham.com.br"],
      replyTo: email,
      subject: `Nova Solicitação de Parceria - ${safeCompany}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">
            Nova Solicitação de Parceria
          </h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Dados do Solicitante</h2>
            <p><strong>Nome:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Telefone:</strong> ${safePhone}</p>
            <p><strong>Empresa:</strong> ${safeCompany}</p>
            <p><strong>Área de Atuação:</strong> ${safeArea}</p>
          </div>
          
          ${safeMessage ? `
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #1a73e8; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Mensagem:</h3>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Esta solicitação foi enviada através do formulário "Seja um Parceiro" no site MasterFisher.</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-partner-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

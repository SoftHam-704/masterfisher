import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Validation schema
const ApprovalEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name is required"),
  type: z.enum(["guide", "supplier", "profile"]),
  status: z.enum(["approved", "rejected"]),
  reason: z.string().optional(),
});

interface ApprovalEmailRequest {
  email: string;
  name: string;
  type: "guide" | "supplier" | "profile";
  status: "approved" | "rejected";
  reason?: string;
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
  console.log("Approval email function invoked");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin or supervisor role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'supervisor'])
      .single();

    if (roleError || !roleData) {
      throw new Error("Insufficient permissions");
    }

    const requestBody = await req.json();
    
    // Validate input data
    const validationResult = ApprovalEmailSchema.safeParse(requestBody);
    
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
    
    const { email, name, type, status, reason }: ApprovalEmailRequest = validationResult.data;
    
    console.log("Processing approval email:", { email, type, status });

    // Escape all user inputs
    const safeName = escapeHtml(name);
    const safeReason = reason ? escapeHtml(reason) : '';

    const typeLabels = {
      guide: "Guia de Pesca",
      supplier: "Fornecedor",
      profile: "Perfil"
    };

    const statusLabels = {
      approved: "aprovado",
      rejected: "rejeitado"
    };

    const emailSubject = status === "approved"
      ? `✅ Seu cadastro de ${typeLabels[type]} foi aprovado!`
      : `❌ Atualização sobre seu cadastro de ${typeLabels[type]}`;

    const emailResponse = await resend.emails.send({
      from: "MasterFisher <masterfisher@softham.com.br>",
      to: [email],
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: ${status === 'approved' ? '#22c55e' : '#ef4444'}; border-bottom: 2px solid ${status === 'approved' ? '#22c55e' : '#ef4444'}; padding-bottom: 10px;">
            ${status === 'approved' ? '🎉 Cadastro Aprovado!' : 'Atualização de Cadastro'}
          </h1>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 16px;">Olá <strong>${safeName}</strong>,</p>
            
            ${status === 'approved' 
              ? `<p>Temos o prazer de informar que seu cadastro como <strong>${typeLabels[type]}</strong> foi <strong style="color: #22c55e;">aprovado</strong>!</p>
                 <p>Você já pode acessar sua conta e começar a aproveitar todos os recursos da plataforma MasterFisher.</p>
                 <div style="margin: 30px 0; text-align: center;">
                   <a href="${Deno.env.get("SUPABASE_URL")?.replace('//', '//').split('/')[0] + '//' + Deno.env.get("SUPABASE_URL")?.split('//')[1].split('.')[0]}.lovable.app/auth" 
                      style="background-color: #1a73e8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                     Acessar Minha Conta
                   </a>
                 </div>`
              : `<p>Informamos que seu cadastro como <strong>${typeLabels[type]}</strong> foi <strong style="color: #ef4444;">rejeitado</strong>.</p>
                 ${safeReason ? `
                   <div style="background-color: #fff; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
                     <h3 style="color: #333; margin-top: 0;">Motivo:</h3>
                     <p style="white-space: pre-wrap;">${safeReason}</p>
                   </div>
                 ` : ''}
                 <p>Se você tiver dúvidas ou desejar mais informações, entre em contato conosco através do email <a href="mailto:masterfisher@softham.com.br">masterfisher@softham.com.br</a>.</p>`
            }
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p><strong>MasterFisher</strong> - Sua plataforma de pesca profissional</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
    });

    console.log("Approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" || error.message === "Insufficient permissions" ? 403 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

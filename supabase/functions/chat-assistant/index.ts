import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MASTERFISHER_CONTEXT = 
Você é o assistente virtual do MasterFisher, uma plataforma brasileira que conecta pescadores amadores com guias profissionais e fornecedores de pesca.

INFORMAÇÕES SOBRE O MASTERFISHER:

1. PROPÓSITO DA PLATAFORMA:
   - Conectar pescadores com guias de pesca profissionais
   - Facilitar reservas de serviços de pesca
   - Promover turismo de pesca no Brasil
   - Conectar fornecedores (lojas, pousadas, hotéis) com pescadores

2. TIPOS DE USUÁRIOS:
   - Pescadores (usuários finais que buscam serviços)
   - Guias de Pesca (profissionais que oferecem serviços)
   - Fornecedores (lojas, pousadas, hotéis)
   - Parceiros Patrocinadores (empresas que anunciam)

3. FUNCIONALIDADES PRINCIPAIS:
   - Busca de serviços de pesca por localização
   - Sistema de reservas e agendamentos
   - Galeria de fotos da comunidade
   - Programa de fidelidade com níveis (Bronze, Prata, Ouro, Platina, Diamante)
   - Previsão do tempo para planejamento
   - Sistema de avaliações
   - Dashboard para guias e fornecedores

4. PLANOS DE PARCEIROS:
   - Plano Gold: R$ 559,00/ano - Propaganda destacada, 2 pontos de logos, perfil destacado
   - Plano Master: Sob consulta - Banner exclusivo, logo 3x maior, página institucional

5. CADASTROS:
   - Guia Profissional: R$ 50,00 (pagamento único) - Acesso vitalício
   - Fornecedores: Planos mensais ou anuais

6. NAVEGAÇÃO:
   - Página inicial: Hero, parceiros, galeria, sobre
   - Encontrar Serviços: Busca com filtros avançados
   - Perfil: Gerenciamento de conta, fotos, dados
   - Dashboard: Métricas e estatísticas

INSTRUÇÕES:
- Seja amigável, prestativo e profissional
- Responda em português brasileiro
- Use emojis quando apropriado para tornar a conversa mais amigável
- Se não souber algo específico, seja honesto e sugira alternativas
- Guie os usuários pelas funcionalidades do portal
- Ajude com dúvidas sobre cadastro, planos, reservas, etc.
- Mantenha respostas concisas mas informativas
;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Get Gemini API key from environment
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    // Call Gemini API
    const response = await fetch(
      https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: MASTERFISHER_CONTEXT + '\\n\\nPergunta do usuário: ' + message,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      throw new Error('Failed to get response from AI')
    }

    const data = await response.json()
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua pergunta.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

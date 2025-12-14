import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { file, caption, location, fishSpecies, fishingDate, riverName } = await req.json();

    // Validar tamanho do Base64 (limite ~1.5MB base64 = ~1.1MB real)
    if (file.length > 2000000) {
      throw new Error('Imagem muito grande. Limite: 1.5MB');
    }

    // Verificar limite de 10 fotos por usuário
    const { count, error: countError } = await supabaseClient
      .from('gallery_photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('Error checking photo count:', countError);
      throw new Error('Erro ao verificar limite de fotos');
    }

    if (count !== null && count >= 10) {
      throw new Error('Limite de 10 fotos atingido. Delete uma foto antes de adicionar outra.');
    }

    // Save base64 image directly to database (no storage needed)
    const { error: dbError } = await supabaseClient
      .from('gallery_photos')
      .insert({
        user_id: user.id,
        storage_path: file, // Save base64 directly
        caption: caption || null,
        location: location || null,
        fish_species: fishSpecies || null,
        fishing_date: fishingDate || null,
        river_name: riverName || null,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

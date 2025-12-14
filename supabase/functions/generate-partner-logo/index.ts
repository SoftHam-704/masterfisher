import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateLogoRequest {
  partnerName: string;
  partnerType: 'prefecture' | 'resort' | 'club';
  theme: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { partnerName, partnerType, theme }: GenerateLogoRequest = await req.json();
    
    console.log(`Generating logo for: ${partnerName}`);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Create professional prompt based on partner type
    let prompt = "";
    if (partnerType === 'prefecture') {
      prompt = `Create a professional, modern logo for ${partnerName}. 
      Style: Clean, governmental, trustworthy with blue and green colors representing water and nature.
      Elements: Incorporate fish silhouette, water waves, or ${theme} symbols.
      Design: Circular or shield badge format, minimalist, vector-style.
      Text: Include the partner name in a clear, professional font.
      Quality: High resolution, suitable for official government tourism materials.`;
    } else if (partnerType === 'resort') {
      prompt = `Create a luxury, premium logo for ${partnerName}.
      Style: Elegant, upscale hospitality brand with gold, navy blue, and earth tones.
      Elements: Incorporate stylized fish, palm trees, water elements, or ${theme} imagery.
      Design: Sophisticated emblem or monogram style, modern yet timeless.
      Text: Include the resort name in an elegant serif or modern font.
      Quality: High resolution, luxury brand quality suitable for 5-star resort marketing.`;
    } else {
      prompt = `Create a professional, adventurous logo for ${partnerName}.
      Style: Bold, outdoorsy, sporting with greens, blues, and natural colors.
      Elements: Incorporate fishing rod, fish jumping, river waves, or ${theme} symbols.
      Design: Dynamic badge or emblem style with movement and energy.
      Text: Include the club name in a strong, athletic font.
      Quality: High resolution, suitable for sporting club branding and merchandise.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    console.log(`Logo generated successfully for ${partnerName}`);

    return new Response(
      JSON.stringify({ 
        imageUrl,
        partnerName 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-partner-logo:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);

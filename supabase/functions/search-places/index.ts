
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query, type } = await req.json()

        if (!GOOGLE_PLACES_API_KEY) {
            console.error("GOOGLE_PLACES_API_KEY is not set");
            // Return empty list if key is missing to not break the frontend
            return new Response(JSON.stringify({ places: [] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        if (!query) {
            return new Response(JSON.stringify({ places: [] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Prepare text search query
        // We append the type to the query to make it more specific if needed, 
        // or rely on the query text itself.
        const textQuery = `${query} ${type !== 'todos' ? type : ''}`.trim();

        console.log(`Searching Google Places for: ${textQuery}`);

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.primaryType,places.editorialSummary,places.photos'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                languageCode: 'pt-BR',
                maxResultCount: 10,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Places API error:", response.status, errorText);
            throw new Error(`Google Places API error: ${response.status}`);
        }

        const data = await response.json()
        const places = data.places || []

        // Map Google Places to our Service interface
        const mappedPlaces = places.map((place: any) => {
            // Approximate price mapping
            let price = 0;
            if (place.priceLevel) {
                switch (place.priceLevel) {
                    case 'PRICE_LEVEL_INEXPENSIVE': price = 50; break;
                    case 'PRICE_LEVEL_MODERATE': price = 150; break;
                    case 'PRICE_LEVEL_EXPENSIVE': price = 300; break;
                    case 'PRICE_LEVEL_VERY_EXPENSIVE': price = 500; break;
                }
            }

            // Photo URL construction
            let imageUrl = null;
            if (place.photos && place.photos.length > 0) {
                // For now, let's use a placeholder if we can't sign the URL.
                imageUrl = null;
            }

            return {
                id: `google-${place.id}`,
                name: place.displayName?.text || 'Local sem nome',
                type: mapGoogleTypeToAppType(place.primaryType),
                location: place.formattedAddress || 'Endereço não disponível',
                description: place.editorialSummary?.text || place.displayName?.text || 'Sem descrição',
                image_url: imageUrl,
                rating: place.rating || 0,
                reviews: place.userRatingCount || 0,
                price: price, // Estimate
                boatType: null,
                hasEquipment: false,
                hasPromotion: false,
                coordinates: [
                    place.location?.longitude || 0,
                    place.location?.latitude || 0
                ],
                source: 'google' // Tag to identify source
            };
        })

        return new Response(JSON.stringify({ places: mappedPlaces }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error processing request:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

function mapGoogleTypeToAppType(googleType: string): string {
    // Map common Google types to our internal types
    if (!googleType) return 'Outro';

    const type = googleType.toLowerCase();
    if (type.includes('lodging') || type.includes('hotel') || type.includes('resort')) return 'Hotel';
    if (type.includes('camp') || type.includes('rv_park')) return 'Pousada';
    if (type.includes('store') || type.includes('shop')) return 'Loja de Pesca';
    if (type.includes('tour') || type.includes('travel')) return 'Guia de Pesca';

    return 'Outro';
}

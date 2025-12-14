import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2, Star, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface Place {
    id: string;
    name: string;
    type: string;
    location: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    coordinates: [number, number];
    image_url?: string | null;
}

const Destinations = () => {
    const { toast } = useToast();
    const [query, setQuery] = useState("");
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);

    const fishingRegions = [
        { name: "Pantanal", query: "pousadas de pesca Pantanal Mato Grosso do Sul" },
        { name: "Amazônia", query: "pousadas de pesca Amazônia Manaus" },
        { name: "Araguaia", query: "pousadas de pesca Rio Araguaia" },
        { name: "Litoral Sul", query: "pesca Florianópolis Santa Catarina" },
    ];

    const searchPlaces = async (searchQuery: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('search-places', {
                body: {
                    query: searchQuery,
                    type: 'pousada hotel'
                }
            });

            if (error) {
                console.error('Supabase function error:', error);
                throw new Error(error.message || 'Erro ao buscar destinos');
            }

            const resultPlaces = data?.places || [];
            setPlaces(resultPlaces);

            if (resultPlaces.length === 0) {
                toast({
                    title: "Nenhum resultado",
                    description: "Tente buscar por outra região ou termo",
                });
            } else {
                toast({
                    title: "Busca concluída!",
                    description: `Encontramos ${resultPlaces.length} ${resultPlaces.length === 1 ? 'local' : 'locais'}`,
                });
            }
        } catch (error: any) {
            console.error('Error searching places:', error);
            toast({
                title: "Erro na busca",
                description: error.message || "Não foi possível buscar os destinos. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            searchPlaces(query);
        }
    };

    const handleRegionClick = (regionQuery: string) => {
        setQuery(regionQuery);
        searchPlaces(regionQuery);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-ocean-gradient">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                            Descubra os Melhores
                            <span className="text-gradient-golden"> Destinos de Pesca</span>
                        </h1>
                        <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                            Encontre pousadas, hotéis e pontos de pesca em todo o Brasil
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ex: pousadas de pesca no Pantanal..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                disabled={loading}
                                className="bg-turquoise hover:bg-turquoise/90"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5" />
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Quick Regions */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {fishingRegions.map((region) => (
                            <Button
                                key={region.name}
                                onClick={() => handleRegionClick(region.query)}
                                disabled={loading}
                                className="bg-ocean-dark/80 hover:bg-ocean-dark text-white border-2 border-white/30 hover:border-white/50"
                            >
                                <MapPin className="w-4 h-4 mr-2" />
                                {region.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Section */}
            {places.length > 0 && (
                <section className="py-12 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="font-display text-3xl font-bold mb-8">
                            {places.length} {places.length === 1 ? 'Resultado Encontrado' : 'Resultados Encontrados'}
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {places.map((place, index) => (
                                <div
                                    key={place.id}
                                    className="group glass-card rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Header com gradiente */}
                                    <div className="relative h-32 bg-gradient-to-br from-turquoise via-ocean-light to-ocean-medium overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold">
                                                {place.type}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="font-display text-xl font-bold text-white line-clamp-1 drop-shadow-lg">
                                                {place.name}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Location */}
                                        <div className="flex items-start gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-turquoise mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {place.location}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {place.description}
                                        </p>

                                        {/* Rating & Price */}
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 text-golden fill-golden" />
                                                <span className="font-semibold text-sm">{place.rating.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">({place.reviews})</span>
                                            </div>
                                            {place.price > 0 && (
                                                <span className="text-sm font-semibold text-golden">
                                                    R$ {place.price}+
                                                </span>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <Button
                                            className="w-full bg-turquoise hover:bg-turquoise/90 text-white"
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.location)}`, '_blank')}
                                        >
                                            <Globe className="w-4 h-4 mr-2" />
                                            Ver no Google Maps
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Empty State */}
            {!loading && places.length === 0 && !query && (
                <section className="py-24">
                    <div className="container mx-auto px-4 text-center">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display text-2xl font-bold mb-2">Comece sua busca!</h3>
                        <p className="text-muted-foreground mb-6">
                            Use a barra de busca acima ou clique em uma das regiões para encontrar destinos de pesca
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Destinations;

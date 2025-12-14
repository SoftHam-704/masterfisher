import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ServicesMap from "@/components/ServicesMap";
import { Search, MapPin, Star, List, LayoutGrid, Filter, X, Map, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  image_url?: string | null;
  rating: number;
  reviews: number;
  price: number;
  boatType?: string | null;
  hasEquipment: boolean;
  hasPromotion: boolean;
  coordinates: [number, number];
}

const FindServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"list" | "grid" | "map">("grid");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Advanced filters
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [boatType, setBoatType] = useState("todos");
  const [hasEquipment, setHasEquipment] = useState(false);
  const [hasPromotion, setHasPromotion] = useState(false);
  
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Erro ao carregar serviços",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Map the data to include default coordinates for demo
      const servicesData: Service[] = (data || []).map((service, index) => ({
        ...service,
        rating: 4.5,
        reviews: 1,
        price: 0,
        boatType: null,
        hasEquipment: false,
        hasPromotion: false,
        coordinates: index === 0 
          ? [-57.6537, -19.0148] as [number, number]
          : index === 1
          ? [-48.2982, -13.8409] as [number, number]
          : [-46.6333, -23.5505] as [number, number]
      }));

      setServices(servicesData);
      setIsLoading(false);
    };

    fetchServices();
  }, [toast]);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Guia de Pesca":
        return "default";
      case "Pousada":
        return "secondary";
      case "Loja de Pesca":
        return "outline";
      default:
        return "default";
    }
  };

  const filteredServices = services.filter(service => {
    // Category filter
    const matchesCategory = category === "todos" || 
      (category === "guia" && service.type === "Guia de Pesca") ||
      (category === "hotel" && service.type === "Hotel") ||
      (category === "pousada" && service.type === "Pousada") ||
      (category === "loja" && service.type === "Loja de Pesca");
    
    // Location filter
    const matchesLocation = !location || 
      service.location.toLowerCase().includes(location.toLowerCase());
    
    // Search term filter
    const matchesSearch = !searchTerm || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Rating filter
    const matchesRating = service.rating >= minRating;
    
    // Price filter
    const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];
    
    // Boat type filter
    const matchesBoatType = boatType === "todos" || service.boatType === boatType;
    
    // Equipment filter
    const matchesEquipment = !hasEquipment || service.hasEquipment;
    
    // Promotion filter
    const matchesPromotion = !hasPromotion || service.hasPromotion;
    
    return matchesCategory && matchesLocation && matchesSearch && 
           matchesRating && matchesPrice && matchesBoatType && 
           matchesEquipment && matchesPromotion;
  });

  const clearAllFilters = () => {
    setMinRating(0);
    setPriceRange([0, 1000]);
    setBoatType("todos");
    setHasEquipment(false);
    setHasPromotion(false);
    setActiveFiltersCount(0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Search Section */}
      <section className="bg-gradient-ocean py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {t('findServices.title')}
            </h1>
            <p className="text-lg text-primary-foreground/90">
              {t('findServices.subtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <Card className="p-6 shadow-ocean">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('findServices.whatLookingFor')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={t('findServices.whereCityRegion')}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t('findServices.category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">{t('findServices.all')}</SelectItem>
                      <SelectItem value="guia">{t('findServices.fishingGuide')}</SelectItem>
                      <SelectItem value="hotel">{t('findServices.hotel')}</SelectItem>
                      <SelectItem value="pousada">{t('findServices.lodge')}</SelectItem>
                      <SelectItem value="loja">{t('findServices.fishingStore')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="lg" className="h-12 px-8">
                  <Search className="mr-2 h-5 w-5" />
                  {t('findServices.search')}
                </Button>
              </div>
              
              {/* Advanced Filters Button */}
              <div className="flex justify-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {t('findServices.advancedFilters')}
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t('findServices.advancedFilters')}</SheetTitle>
                      <SheetDescription>
                        {t('findServices.refineSearch')}
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="space-y-6 mt-6">
                      {/* Rating Filter */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          {t('findServices.minRating')}
                        </label>
                        <div className="flex gap-2">
                          {[0, 3, 4, 4.5].map((rating) => (
                            <Button
                              key={rating}
                              variant={minRating === rating ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMinRating(rating)}
                            >
                              {rating === 0 ? t('findServices.allRatings') : `${rating}+`}
                              {rating > 0 && <Star className="ml-1 h-3 w-3 fill-current" />}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          {t('findServices.priceRange')}
                        </label>
                        <div className="space-y-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000}
                            step={50}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>R$ {priceRange[0]}</span>
                            <span>R$ {priceRange[1]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Boat Type Filter */}
                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          {t('findServices.boatType')}
                        </label>
                        <Select value={boatType} onValueChange={setBoatType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">{t('findServices.all')}</SelectItem>
                            <SelectItem value="lancha">{t('findServices.speedboat')}</SelectItem>
                            <SelectItem value="aluminio">{t('findServices.aluminumBoat')}</SelectItem>
                            <SelectItem value="madeira">{t('findServices.woodenBoat')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Equipment Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t('findServices.equipmentIncluded')}
                        </label>
                        <Button
                          variant={hasEquipment ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHasEquipment(!hasEquipment)}
                        >
                          {hasEquipment ? t('findServices.yes') : t('findServices.no')}
                        </Button>
                      </div>

                      {/* Promotion Filter */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          {t('findServices.onlyPromotions')}
                        </label>
                        <Button
                          variant={hasPromotion ? "default" : "outline"}
                          size="sm"
                          onClick={() => setHasPromotion(!hasPromotion)}
                        >
                          {hasPromotion ? t('findServices.yes') : t('findServices.no')}
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={clearAllFilters}
                      >
                        <X className="mr-2 h-4 w-4" />
                        {t('findServices.clearFilters')}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 flex-1">
        <div className="container mx-auto max-w-6xl">
          {/* Results Count and View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {filteredServices.length} {filteredServices.length === 1 ? t('findServices.resultFound') : t('findServices.resultsFound')}
            </p>
            <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-5 w-5" />
            </Button>
            </div>
          </div>

          {/* Map View */}
          {viewMode === "map" && (
            <ServicesMap
              services={filteredServices}
              onServiceSelect={(id) => navigate(`/servico/${id}`)}
            />
          )}

          {/* Results Grid/List */}
          {viewMode !== "map" && (
            <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-ocean transition-all duration-300 animate-fade-in">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant={getBadgeVariant(service.type)} className="shadow-md">
                      {service.type}
                    </Badge>
                    {service.hasPromotion && (
                      <Badge variant="destructive" className="shadow-md">
                        {t('findServices.promotion')}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{service.location}</span>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(service.rating)
                            ? "fill-accent text-accent"
                            : "text-muted"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-foreground">
                      {service.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      ({service.reviews} {service.reviews === 1 ? t('findServices.rating') : t('findServices.ratings')})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/servico/${service.id}`)}
                  >
                    {t('findServices.viewDetails')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}

          {filteredServices.length === 0 && viewMode !== "map" && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {t('findServices.noResults')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 MasterFisher. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FindServices;

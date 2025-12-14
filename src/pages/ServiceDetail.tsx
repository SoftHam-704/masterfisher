import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";
import BookingForm from "@/components/BookingForm";
import BookingsList from "@/components/BookingsList";
import { MapPin, Star, ArrowLeft, Phone, Mail, Globe, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  image_url?: string | null;
  features?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const [bookingRefreshTrigger, setBookingRefreshTrigger] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        toast({
          title: "Erro",
          description: "ID do serviço não encontrado.",
          variant: "destructive",
        });
        navigate("/encontrar-servicos");
        return;
      }

      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching service:", error);
        toast({
          title: "Erro ao carregar serviço",
          description: error.message,
          variant: "destructive",
        });
        navigate("/encontrar-servicos");
        return;
      }

      if (!data) {
        toast({
          title: "Serviço não encontrado",
          description: "O serviço solicitado não existe.",
          variant: "destructive",
        });
        navigate("/encontrar-servicos");
        return;
      }

      // Transform the data to match our Service interface
      const serviceData: Service = {
        ...data,
        features: Array.isArray(data.features) ? data.features as string[] : [],
      };

      setService(serviceData);
      setIsLoading(false);
    };

    fetchService();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

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

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger(prev => prev + 1);
  };

  const handleBookingCreated = () => {
    setBookingRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="relative h-96 rounded-lg overflow-hidden shadow-ocean">
            <img
              src={service.image_url || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant={getBadgeVariant(service.type)} className="mb-3">
                {service.type}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {service.name}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{service.location}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Sobre</h2>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>

            {service.features && service.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">O que está incluído</h2>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              {service.phone && (
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-5 w-5 mr-3" />
                  <a href={`tel:${service.phone}`} className="hover:text-primary transition-colors">
                    {service.phone}
                  </a>
                </div>
              )}
              {service.email && (
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-5 w-5 mr-3" />
                  <a href={`mailto:${service.email}`} className="hover:text-primary transition-colors">
                    {service.email}
                  </a>
                </div>
              )}
              {service.website && (
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-5 w-5 mr-3" />
                  <a 
                    href={service.website.startsWith('http') ? service.website : `https://${service.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {service.website}
                  </a>
                </div>
              )}
            </div>

            <Button size="lg" className="w-full">
              Entrar em Contato
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Agendar Serviço</h2>
              
              <Tabs defaultValue="new" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="new">Nova Reserva</TabsTrigger>
                  <TabsTrigger value="my-bookings">Minhas Reservas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="new">
                  <BookingForm 
                    serviceId={service.id}
                    onBookingCreated={handleBookingCreated}
                  />
                </TabsContent>
                
                <TabsContent value="my-bookings">
                  {userId ? (
                    <BookingsList 
                      userId={userId}
                      refreshTrigger={bookingRefreshTrigger}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Faça login para ver suas reservas.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="all">Todas as Avaliações</TabsTrigger>
                  <TabsTrigger value="add">Adicionar Avaliação</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <ReviewsList 
                    serviceId={service.id} 
                    refreshTrigger={reviewRefreshTrigger}
                  />
                </TabsContent>
                
                <TabsContent value="add">
                  <ReviewForm 
                    serviceId={service.id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

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

export default ServiceDetail;

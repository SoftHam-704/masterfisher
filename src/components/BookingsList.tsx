import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WeatherForecast from "@/components/WeatherForecast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: string;
  guests_count: number;
  notes: string | null;
  created_at: string;
}

interface BookingsListProps {
  userId: string;
  refreshTrigger?: number;
}

const BookingsList = ({ userId, refreshTrigger = 0 }: BookingsListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: true });

      if (!error && data) {
        setBookings(data);
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [userId, refreshTrigger]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Erro ao cancelar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reserva cancelada",
      description: "Sua reserva foi cancelada com sucesso.",
    });

    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg">Você ainda não tem reservas.</p>
        <p className="text-sm mt-2">Faça sua primeira reserva!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="animate-fade-in">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <Badge variant={getStatusVariant(booking.status)}>
                {getStatusLabel(booking.status)}
              </Badge>
              {booking.status === "pending" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancelar
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-foreground">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">
                  {new Date(booking.start_date + 'T00:00:00').toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  {booking.start_date !== booking.end_date && (
                    <>
                      {" - "}
                      {new Date(booking.end_date + 'T00:00:00').toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                </span>
              </div>

              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>{booking.guests_count} {booking.guests_count === 1 ? "pessoa" : "pessoas"}</span>
              </div>

              {booking.notes && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">{booking.notes}</p>
                </div>
              )}

              <div className="mt-4">
                <WeatherForecast date={new Date(booking.start_date + 'T00:00:00')} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;

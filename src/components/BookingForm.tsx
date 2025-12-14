import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookingCalendar from "@/components/BookingCalendar";
import WeatherForecast from "@/components/WeatherForecast";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users } from "lucide-react";

interface BookingFormProps {
  serviceId: string;
  onBookingCreated: () => void;
}

const BookingForm = ({ serviceId, onBookingCreated }: BookingFormProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestsCount, setGuestsCount] = useState("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Datas necessárias",
        description: "Por favor, selecione a data de início e fim da reserva.",
        variant: "destructive",
      });
      return;
    }

    if (!startTime || !endTime) {
      toast({
        title: "Horário necessário",
        description: "Por favor, selecione o horário de início e fim.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer uma reserva.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .insert({
        service_id: serviceId,
        user_id: user.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        guests_count: parseInt(guestsCount),
        notes: notes.trim() || null,
      });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Erro ao criar reserva",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reserva criada!",
      description: "Sua reserva foi enviada e está aguardando confirmação.",
    });

    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("");
    setEndTime("");
    setGuestsCount("1");
    setNotes("");
    onBookingCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            Data de Início
          </Label>
          <BookingCalendar
            selectedDate={startDate}
            onDateSelect={setStartDate}
          />
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4" />
            Data de Término
          </Label>
          <BookingCalendar
            selectedDate={endDate}
            onDateSelect={setEndDate}
          />
        </div>
      </div>

      {startDate && (
        <div className="mt-4">
          <WeatherForecast date={startDate} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime" className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            Horário de Início
          </Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="endTime" className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4" />
            Horário de Término
          </Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger id="endTime">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          Número de Pessoas
        </Label>
        <Input
          id="guests"
          type="number"
          min="1"
          max="10"
          value={guestsCount}
          onChange={(e) => setGuestsCount(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione informações relevantes para o prestador de serviço..."
          rows={3}
          maxLength={500}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "Enviando..." : "Confirmar Reserva"}
      </Button>
    </form>
  );
};

export default BookingForm;

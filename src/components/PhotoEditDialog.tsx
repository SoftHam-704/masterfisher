import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const photoEditSchema = z.object({
  caption: z.string().max(500, "Legenda deve ter no máximo 500 caracteres").optional(),
  location: z.string().max(200, "Localização deve ter no máximo 200 caracteres").optional(),
  fish_species: z.string().max(100, "Espécie deve ter no máximo 100 caracteres").optional(),
  river_name: z.string().max(200, "Nome do rio deve ter no máximo 200 caracteres").optional(),
});

interface PhotoEditDialogProps {
  photoId: string;
  currentCaption: string | null;
  currentLocation: string | null;
  currentFishSpecies: string | null;
  currentFishingDate: string | null;
  currentRiverName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PhotoEditDialog = ({
  photoId,
  currentCaption,
  currentLocation,
  currentFishSpecies,
  currentFishingDate,
  currentRiverName,
  open,
  onOpenChange,
  onSuccess,
}: PhotoEditDialogProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [caption, setCaption] = useState(currentCaption || "");
  const [location, setLocation] = useState(currentLocation || "");
  const [fishSpecies, setFishSpecies] = useState(currentFishSpecies || "");
  const [riverName, setRiverName] = useState(currentRiverName || "");
  const [fishingDate, setFishingDate] = useState<Date | undefined>(
    currentFishingDate ? new Date(currentFishingDate) : undefined
  );

  const handleUpdate = async () => {
    // Validar campos
    try {
      photoEditSchema.parse({
        caption,
        location,
        fish_species: fishSpecies,
        river_name: riverName,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('gallery_photos')
        .update({
          caption: caption.trim() || null,
          location: location.trim() || null,
          fish_species: fishSpecies.trim() || null,
          fishing_date: fishingDate ? format(fishingDate, "yyyy-MM-dd") : null,
          river_name: riverName.trim() || null,
        })
        .eq('id', photoId);

      if (error) {
        throw error;
      }

      toast({
        title: "Foto atualizada com sucesso",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Informações da Foto</DialogTitle>
          <DialogDescription>
            Atualize as informações desta foto da sua galeria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Legenda</Label>
            <Textarea
              id="caption"
              placeholder="Adicione uma legenda..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {caption.length}/500 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              placeholder="Ex: Pantanal Sul Mato-Grossense"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fishSpecies">Espécie do Peixe</Label>
            <Input
              id="fishSpecies"
              placeholder="Ex: Tucunaré Azul"
              value={fishSpecies}
              onChange={(e) => setFishSpecies(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riverName">Rio</Label>
            <Input
              id="riverName"
              placeholder="Ex: Rio Paraguai"
              value={riverName}
              onChange={(e) => setRiverName(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label>Data da Pescaria</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fishingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fishingDate ? (
                    format(fishingDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fishingDate}
                  onSelect={setFishingDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoEditDialog;

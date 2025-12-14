import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, CalendarIcon } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const photoSchema = z.object({
  caption: z.string().max(500, "Legenda deve ter no máximo 500 caracteres").optional(),
  location: z.string().max(200, "Localização deve ter no máximo 200 caracteres").optional(),
  fish_species: z.string().max(100, "Espécie deve ter no máximo 100 caracteres").optional(),
  river_name: z.string().max(200, "Nome do rio deve ter no máximo 200 caracteres").optional(),
});

interface GalleryUploadProps {
  userId: string;
  onUploadSuccess?: () => void;
}

const GalleryUpload = ({ userId, onUploadSuccess }: GalleryUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [fishSpecies, setFishSpecies] = useState("");
  const [riverName, setRiverName] = useState("");
  const [fishingDate, setFishingDate] = useState<Date | undefined>(undefined);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    fetchPhotoCount();
  }, [userId]);

  const fetchPhotoCount = async () => {
    const { count } = await supabase
      .from('gallery_photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    setPhotoCount(count || 0);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Comprimir para JPEG com qualidade 70%
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Verificar limite de 10 fotos total
    if (photoCount + files.length > 10) {
      toast({
        title: "Limite de fotos atingido",
        description: `Você já tem ${photoCount} fotos. Pode adicionar no máximo ${10 - photoCount} foto(s).`,
        variant: "destructive",
      });
      return;
    }

    // Validar tipo de arquivo
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Arquivos inválidos",
        description: "Apenas imagens são permitidas",
        variant: "destructive",
      });
    }

    // Validar tamanho (máximo 500KB por arquivo após compressão)
    const oversizedFiles = validFiles.filter(file => file.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivos muito grandes",
        description: "Cada imagem deve ter no máximo 2MB (será comprimida automaticamente)",
        variant: "destructive",
      });
      return;
    }

    // Limitar a 5 fotos por vez
    if (validFiles.length > 5) {
      toast({
        title: "Muitas fotos",
        description: "Você pode fazer upload de no máximo 5 fotos por vez",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(validFiles);

    // Criar URLs de preview
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Liberar URL antiga
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nenhuma foto selecionada",
        description: "Por favor, selecione pelo menos uma foto",
        variant: "destructive",
      });
      return;
    }

    // Validar campos
    try {
      photoSchema.parse({
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

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para fazer upload.",
          variant: "destructive",
        });
        return;
      }

      for (const file of selectedFiles) {
        // Comprimir imagem antes do upload
        const compressedBase64 = await compressImage(file);

        // Call edge function to handle upload (saves base64 directly)
        const { data, error } = await supabase.functions.invoke('upload-gallery-photo', {
          body: {
            file: compressedBase64,
            caption: caption.trim() || null,
            location: location.trim() || null,
            fishSpecies: fishSpecies.trim() || null,
            riverName: riverName.trim() || null,
            fishingDate: fishingDate ? format(fishingDate, "yyyy-MM-dd") : null,
          }
        });

        if (error) {
          console.error('Erro no upload:', error);
          throw new Error(error.message || 'Erro ao fazer upload');
        }

        if (!data?.success) {
          throw new Error('Falha no upload');
        }
      }

      toast({
        title: "Fotos enviadas com sucesso!",
        description: `${selectedFiles.length} foto(s) adicionada(s) à galeria`,
      });

      // Limpar formulário
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCaption("");
      setLocation("");
      setFishSpecies("");
      setRiverName("");
      setFishingDate(undefined);
      fetchPhotoCount();

      // Callback de sucesso
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error: any) {
      console.error('Erro completo no upload:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao enviar as fotos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Adicionar Fotos à Galeria
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Máximo 5 fotos por vez. Cada imagem será comprimida automaticamente.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {photoCount}/10 fotos
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="photos">Selecionar Fotos (até 5)</Label>
          <div className="mt-2">
            <input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading || photoCount >= 10}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photos')?.click()}
              disabled={isUploading || photoCount >= 10}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {photoCount >= 10 ? "Limite de 10 fotos atingido" : "Escolher Fotos"}
            </Button>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <Label htmlFor="caption">Legenda (opcional)</Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Conte sobre sua pescaria..."
            maxLength={500}
            rows={3}
            className="mt-2"
            disabled={isUploading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Localização (opcional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Pantanal Sul"
              maxLength={200}
              className="mt-2"
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="fishSpecies">Espécie do Peixe (opcional)</Label>
            <Input
              id="fishSpecies"
              value={fishSpecies}
              onChange={(e) => setFishSpecies(e.target.value)}
              placeholder="Ex: Tucunaré Azul"
              maxLength={100}
              className="mt-2"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="riverName">Rio (opcional)</Label>
            <Input
              id="riverName"
              value={riverName}
              onChange={(e) => setRiverName(e.target.value)}
              placeholder="Ex: Rio Paraguai"
              maxLength={200}
              className="mt-2"
              disabled={isUploading}
            />
          </div>

          <div>
            <Label>Data da Pescaria (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !fishingDate && "text-muted-foreground"
                  )}
                  disabled={isUploading}
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

        <Button
          onClick={handleUpload}
          disabled={isUploading || selectedFiles.length === 0}
          className="w-full"
        >
          {isUploading ? "Enviando..." : `Enviar ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""} Foto(s)`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GalleryUpload;
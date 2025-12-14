import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Fish, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import PhotoEditDialog from "./PhotoEditDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GalleryPhoto {
  id: string;
  storage_path: string;
  caption: string | null;
  location: string | null;
  fish_species: string | null;
  fishing_date: string | null;
  river_name: string | null;
  created_at: string;
  user_id: string;
}

interface UserGalleryProps {
  userId: string;
  refreshTrigger?: number;
}

const UserGallery = ({ userId, refreshTrigger }: UserGalleryProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [photoCount, setPhotoCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    setPhotos([]);
    setPage(0);
    setHasMore(true);
    fetchPhotos(0);
  }, [userId, refreshTrigger]);

  const fetchPhotos = async (pageNumber: number = 0) => {
    setIsLoading(true);
    
    const from = pageNumber * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    
    // Buscar fotos com paginação
    const { data, error } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    // Buscar contagem total
    const { count } = await supabase
      .from('gallery_photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao carregar fotos:', error);
      toast({
        title: "Erro ao carregar fotos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      if (pageNumber === 0) {
        setPhotos(data || []);
      } else {
        setPhotos(prev => [...prev, ...(data || [])]);
      }
      setHasMore(data ? data.length === ITEMS_PER_PAGE : false);
      setPhotoCount(count || 0);
    }
    setIsLoading(false);
  };

  const handleDelete = async (photoId: string, storagePath: string) => {
    try {
      // Se não for base64 (fotos novas que estão no storage)
      if (!storagePath.startsWith('data:')) {
        // Extrair o caminho do arquivo da URL pública
        // URL format: https://.../storage/v1/object/public/gallery/user_id/filename.jpg
        const urlParts = storagePath.split('/gallery/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1]; // user_id/filename.jpg
          
          // Deletar do storage
          const { error: storageError } = await supabase.storage
            .from('gallery')
            .remove([filePath]);

          if (storageError) {
            console.error('Erro ao deletar do storage:', storageError);
            // Continuar mesmo com erro no storage, pois a foto pode já não existir
          }
        }
      }

      // Deletar do banco de dados
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Foto deletada com sucesso",
      });

      setPhotos([]);
      setPage(0);
      setHasMore(true);
      fetchPhotos(0);
    } catch (error: any) {
      console.error('Erro ao deletar foto:', error);
      toast({
        title: "Erro ao deletar foto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPhotoToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando fotos...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Minha Galeria</h2>
          <div className="text-sm text-muted-foreground">
            {photoCount}/10 fotos
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">
            Você ainda não tem fotos na galeria
          </p>
          <p className="text-sm text-muted-foreground">
            Faça upload de suas melhores pescarias! (Máximo 10 fotos)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Minha Galeria</h2>
        <div className="text-sm text-muted-foreground">
          {photoCount}/10 fotos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={photo.storage_path}
                alt={photo.caption || "Foto da galeria"}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-4 space-y-2">
              {photo.caption && (
                <p className="text-sm">{photo.caption}</p>
              )}
              {photo.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {photo.location}
                </div>
              )}
              {photo.fish_species && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Fish className="h-3 w-3" />
                  {photo.fish_species}
                </div>
              )}
              {photo.river_name && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Fish className="h-3 w-3" />
                  Rio: {photo.river_name}
                </div>
              )}
              {photo.fishing_date && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(photo.fishing_date), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPhoto(photo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPhotoToDelete(photo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && !isLoading && (
        <div className="text-center mt-6">
          <Button 
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchPhotos(nextPage);
            }}
            variant="outline"
          >
            Carregar mais fotos
          </Button>
        </div>
      )}

      {editingPhoto && (
        <PhotoEditDialog
          photoId={editingPhoto.id}
          currentCaption={editingPhoto.caption}
          currentLocation={editingPhoto.location}
          currentFishSpecies={editingPhoto.fish_species}
          currentFishingDate={editingPhoto.fishing_date}
          currentRiverName={editingPhoto.river_name}
          open={editingPhoto !== null}
          onOpenChange={(open) => !open && setEditingPhoto(null)}
          onSuccess={() => {
            setPhotos([]);
            setPage(0);
            setHasMore(true);
            fetchPhotos(0);
          }}
        />
      )}

      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A foto será removida permanentemente da galeria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const photo = photos.find(p => p.id === photoToDelete);
                if (photo) {
                  handleDelete(photo.id, photo.storage_path);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserGallery;
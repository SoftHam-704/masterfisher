import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, X, Camera } from 'lucide-react';

interface PhotoUploadProps {
    onUploadComplete?: (url: string) => void;
    currentPhotoUrl?: string | null;
    label?: string;
    description?: string;
    bucket?: string;
    folder?: string;
}

export function PhotoUpload({ 
    onUploadComplete, 
    currentPhotoUrl,
    label = "Sua Foto *",
    description = "Envie uma foto profissional que sera exibida no portal",
    bucket = "partner-logos",
    folder = "guide-photos"
}: PhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
    const { toast } = useToast();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            const file = event.target.files?.[0];
            if (!file) return;

            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast({
                    title: 'Erro',
                    description: 'Por favor, envie apenas arquivos PNG, JPG ou WebP',
                    variant: 'destructive'
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: 'Erro',
                    description: 'A imagem deve ter no maximo 5MB',
                    variant: 'destructive'
                });
                return;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setPhotoUrl(publicUrl);

            toast({
                title: 'Sucesso!',
                description: 'Foto enviada com sucesso'
            });

            if (onUploadComplete) {
                onUploadComplete(publicUrl);
            }

        } catch (error: any) {
            console.error('Erro no upload:', error);
            toast({
                title: 'Erro no upload',
                description: error.message || 'Nao foi possivel fazer upload da foto',
                variant: 'destructive'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoUrl(null);
        if (onUploadComplete) {
            onUploadComplete('');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="photo-upload" className="text-base font-semibold">
                    {label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                    {description}
                </p>
            </div>

            {!photoUrl ? (
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                            <Camera className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                                Clique para selecionar uma foto
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PNG, JPG ou WebP (max. 5MB)
                            </p>
                        </div>
                        <Input
                            id="photo-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                        />
                    </div>
                    {uploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Enviando...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="border-2 border-dashed border-green-500 rounded-lg p-6 bg-green-50">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold">Foto enviada com sucesso!</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemovePhoto}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Remover
                        </Button>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-3">Preview da foto:</p>
                        <div className="flex justify-center items-center bg-gray-50 p-4 rounded">
                            <img
                                src={photoUrl}
                                alt="Photo preview"
                                className="max-w-full max-h-48 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Dicas para uma boa foto:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>Use uma foto com boa iluminacao</li>
                    <li>Prefira fotos em ambiente de pesca</li>
                    <li>Mostre seu rosto claramente</li>
                    <li>Evite fotos com oculos escuros</li>
                    <li>Resolucao recomendada: 800x600px ou maior</li>
                </ul>
            </div>
        </div>
    );
}

export default PhotoUpload;

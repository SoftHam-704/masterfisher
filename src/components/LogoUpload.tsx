import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, CheckCircle, X } from 'lucide-react';

interface LogoUploadProps {
    userId?: string;
    userType?: 'sponsor' | 'supplier';
    onUploadComplete?: (url: string) => void;
    currentLogoUrl?: string;
}

export function LogoUpload({ userId = 'temp', userType = 'supplier', onUploadComplete, currentLogoUrl }: LogoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(currentLogoUrl || null);
    const { toast } = useToast();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            const file = event.target.files?.[0];
            if (!file) return;

            // Validar tipo de arquivo
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast({
                    title: 'Erro',
                    description: 'Por favor, envie apenas arquivos PNG, JPG, SVG ou WebP',
                    variant: 'destructive'
                });
                return;
            }

            // Validar tamanho (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: 'Erro',
                    description: 'A imagem deve ter no máximo 2MB',
                    variant: 'destructive'
                });
                return;
            }

            // Criar nome único para o arquivo
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId || Date.now()}-${Date.now()}.${fileExt}`;
            const filePath = `${userType}-logos/${fileName}`;

            // Upload para Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from('partner-logos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Obter URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('partner-logos')
                .getPublicUrl(filePath);

            setLogoUrl(publicUrl);

            toast({
                title: 'Sucesso!',
                description: 'Logo enviado com sucesso'
            });

            if (onUploadComplete) {
                onUploadComplete(publicUrl);
            }

        } catch (error: any) {
            console.error('Erro no upload:', error);
            toast({
                title: 'Erro no upload',
                description: error.message || 'Não foi possível fazer upload do logo',
                variant: 'destructive'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveLogo = () => {
        setLogoUrl(null);
        if (onUploadComplete) {
            onUploadComplete('');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="logo-upload" className="text-base font-semibold">
                    Logotipo da Empresa *
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                    Envie o logotipo que será exibido no portal
                </p>
            </div>

            {!logoUrl ? (
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            id="logo-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="cursor-pointer"
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
                            <span className="font-semibold">Logo enviado com sucesso!</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveLogo}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Remover
                        </Button>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground mb-3">Preview do logo:</p>
                        <div className="flex justify-center items-center bg-gray-50 p-6 rounded">
                            <img
                                src={logoUrl}
                                alt="Logo preview"
                                className="max-w-full max-h-40 object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Requisitos do Logo:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Formatos aceitos: PNG, JPG, SVG, WebP</li>
                    <li>✓ Tamanho máximo: 2MB</li>
                    <li>✓ Recomendado: fundo transparente (PNG ou SVG)</li>
                    <li>✓ Proporção ideal: quadrada (1:1) ou horizontal (16:9)</li>
                    <li>✓ Resolução mínima: 500x500px</li>
                </ul>
            </div>
        </div>
    );
}

export default LogoUpload;

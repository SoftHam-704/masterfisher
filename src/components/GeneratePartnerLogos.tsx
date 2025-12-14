import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: 'prefecture' | 'resort' | 'club';
  theme: string;
}

const partners: Partner[] = [
  { 
    id: 'bonito', 
    name: 'Prefeitura de Bonito - MS', 
    type: 'prefecture',
    theme: 'ecoturismo e águas cristalinas'
  },
  { 
    id: 'pantanal', 
    name: 'Pantanal Fishing Lodge', 
    type: 'resort',
    theme: 'pantanal e pesca premium'
  },
  { 
    id: 'caceres', 
    name: 'Prefeitura de Cáceres - MT', 
    type: 'prefecture',
    theme: 'festival internacional de pesca'
  },
  { 
    id: 'amazon', 
    name: 'Amazon Fishing Resort', 
    type: 'resort',
    theme: 'amazônia e tucunaré'
  },
  { 
    id: 'corumba', 
    name: 'Secretaria de Turismo - Corumbá MS', 
    type: 'prefecture',
    theme: 'portal do pantanal'
  },
  { 
    id: 'araguaia', 
    name: 'Rio Araguaia Fishing Club', 
    type: 'club',
    theme: 'rio araguaia e pesca esportiva'
  },
];

export function GeneratePartnerLogos() {
  const [generating, setGenerating] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<string>("");
  const [generatedLogos, setGeneratedLogos] = useState<Record<string, string>>({});
  const [sponsorIds, setSponsorIds] = useState<Record<string, string>>({});
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  // Verificar permissões ao montar o componente
  useEffect(() => {
    const checkPermissions = async () => {
      setIsCheckingPermission(true);
      
      try {
        // Obter usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Erro ao obter usuário:', userError);
          setHasPermission(false);
          toast.error('Erro ao verificar usuário. Faça login novamente.');
          setIsCheckingPermission(false);
          return;
        }
        // Verificar se é o email autorizado
        const isAuthorizedEmail = user.email === 'softham2008@gmail.com';
        if (isAuthorizedEmail) {
          setHasPermission(true);
          console.log('✓ Acesso concedido via email autorizado');
          setIsCheckingPermission(false);
          return;
        }
        // Se não for o email autorizado, verificar se tem role 'supervisor'
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'supervisor')
          .maybeSingle();
        if (rolesError && rolesError.code !== 'PGRST116') {
          console.error('Erro ao verificar permissões:', rolesError);
        }
        const hasSupervisorRole = !!roles;
        setHasPermission(hasSupervisorRole);
        
        if (!hasSupervisorRole) {
          toast.error('Você precisa ter permissão de Administrador para gerar logos. Entre em contato com um administrador do sistema.', {
            duration: 6000
          });
        } else {
          console.log('✓ Permissões de supervisor verificadas com sucesso');
        }
        
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setHasPermission(false);
        toast.error('Erro ao verificar permissões');
      } finally {
        setIsCheckingPermission(false);
      }
    };
    checkPermissions();
  }, []);
  
  // Buscar os IDs reais dos sponsors do banco ao montar o componente
  useEffect(() => {
    const fetchSponsorIds = async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('id, name')
        .eq('tier', 'master');
      
      if (!error && data) {
        const ids: Record<string, string> = {};
        data.forEach(sponsor => {
          ids[sponsor.name] = sponsor.id;
        });
        setSponsorIds(ids);
        console.log('IDs dos sponsors carregados:', ids);
      }
    };
    fetchSponsorIds();
  }, []);

  const generateLogo = async (partner: Partner) => {
    setCurrentPartner(partner.name);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-partner-logo', {
        body: {
          partnerName: partner.name,
          partnerType: partner.type,
          theme: partner.theme
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        console.log(`Logo recebido para ${partner.name}, tamanho: ${data.imageUrl.length} caracteres`);
        
        // Convert base64 to blob and create object URL for preview
        const blob = await fetch(data.imageUrl).then(r => r.blob());
        const objectUrl = URL.createObjectURL(blob);
        
        setGeneratedLogos(prev => ({
          ...prev,
          [partner.id]: objectUrl
        }));

        // Buscar o ID real do sponsor no banco
        const sponsorId = sponsorIds[partner.name];
        
        if (!sponsorId) {
          console.error(`ID não encontrado para ${partner.name}`);
          toast.error(`Erro: ID não encontrado para ${partner.name}`);
          throw new Error(`ID não encontrado para ${partner.name}`);
        }

        console.log(`Salvando logo no banco usando ID: ${sponsorId} para ${partner.name}`);
        
        // Usar o ID para atualizar
        const { data: updateData, error: updateError } = await supabase
          .from('sponsors')
          .update({ logo_url: data.imageUrl })
          .eq('id', sponsorId)
          .select();

        if (updateError) {
          console.error('Erro ao salvar logo no banco:', updateError);
          toast.error(`Erro ao salvar: ${updateError.message}`);
          throw updateError;
        } else if (!updateData || updateData.length === 0) {
          console.error(`Nenhum registro atualizado para ${partner.name} (ID: ${sponsorId})`);
          toast.error(`Nenhum registro foi atualizado para ${partner.name}`);
          throw new Error('Nenhum registro atualizado');
        } else {
          console.log(`✓ Logo salvo com sucesso para ${partner.name}`, updateData);
          toast.success(`✓ Logo salvo: ${partner.name}`);
        }
        
        return data.imageUrl;
      }
    } catch (error: any) {
      console.error('Error generating logo:', error);
      toast.error(`Erro ao gerar logo: ${error.message}`);
      throw error;
    }
  };

  const generateAllLogos = async () => {
    setGenerating(true);
    let successCount = 0;
    
    try {
      for (const partner of partners) {
        try {
          await generateLogo(partner);
          successCount++;
        } catch (error) {
          console.error(`Erro ao gerar logo para ${partner.name}:`, error);
        }
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      toast.success(`${successCount} de ${partners.length} logos gerados e salvos! Recarregue a página inicial para ver as mudanças.`, {
        duration: 5000
      });
    } catch (error) {
      toast.error('Erro ao gerar alguns logos');
    } finally {
      setGenerating(false);
      setCurrentPartner("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Gerar Logos com IA
        </CardTitle>
        <CardDescription>
          Gere logos profissionais personalizados para todos os parceiros Master
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCheckingPermission ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Verificando permissões...</span>
          </div>
        ) : hasPermission === false ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">
              ⚠️ Permissão Negada
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Você precisa ter permissão de <strong>Administrador</strong> para gerar logos. 
              Entre em contato com um administrador do sistema para obter acesso.
            </p>
          </div>
        ) : (
          <Button 
            onClick={generateAllLogos}
            disabled={generating || !hasPermission}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando {currentPartner}...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Todos os Logos (6)
              </>
            )}
          </Button>
        )}

        {Object.keys(generatedLogos).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Logos Gerados:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {partners.map((partner) => (
                generatedLogos[partner.id] && (
                  <div key={partner.id} className="space-y-2">
                    <img 
                      src={generatedLogos[partner.id]} 
                      alt={partner.name}
                      className="w-full h-32 object-contain bg-muted rounded-lg p-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">
                      {partner.name}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

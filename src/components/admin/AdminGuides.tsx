import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, Fish, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Guide {
  id: string;
  user_id: string;
  full_name: string;
  cpf: string;
  birth_date: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  experience_years: number;
  specialties: string[];
  languages: string[];
  certifications: string | null;
  availability: string;
  service_areas: string[];
  equipment_list: string;
  half_day_price: number;
  full_day_price: number;
  additional_services: string | null;
  approval_status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminGuides = () => {
  const { toast } = useToast();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [viewingGuide, setViewingGuide] = useState<Guide | null>(null);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    const { data: allGuides } = await (supabase as any)
      .from("guides")
      .select("*")
      .order("created_at", { ascending: false });

    if (allGuides) setGuides(allGuides as any);
  };

  const safeJoinArray = (value: any): string => {
    if (!value) return "Não informado";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(", ");
        return value;
      } catch {
        return value;
      }
    }
    return "Não informado";
  };

  const handleApproveGuide = async (guideId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: guide } = await (supabase as any)
      .from("guides")
      .select("full_name, email")
      .eq("id", guideId)
      .single();
    
    const { error } = await (supabase as any)
      .from("guides")
      .update({
        approval_status: "approved",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", guideId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o guia.",
        variant: "destructive",
      });
      return;
    }

    if (guide?.email) {
      await supabase.functions.invoke("send-approval-email", {
        body: {
          email: guide.email,
          name: guide.full_name,
          type: "guide",
          status: "approved"
        }
      });
    }

    toast({
      title: "Guia Aprovado",
      description: "O guia foi aprovado e notificado por email.",
    });

    loadGuides();
  };

  const handleRejectGuide = async (guideId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: guide } = await (supabase as any)
      .from("guides")
      .select("full_name, email")
      .eq("id", guideId)
      .single();
    
    const reason = prompt("Digite o motivo da rejeição (opcional):");
    
    const { error } = await (supabase as any)
      .from("guides")
      .update({
        approval_status: "rejected",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", guideId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o guia.",
        variant: "destructive",
      });
      return;
    }

    if (guide?.email) {
      await supabase.functions.invoke("send-approval-email", {
        body: {
          email: guide.email,
          name: guide.full_name,
          type: "guide",
          status: "rejected",
          reason: reason || undefined
        }
      });
    }

    toast({
      title: "Guia Rejeitado",
      description: "O guia foi rejeitado e notificado por email.",
      variant: "destructive",
    });

    loadGuides();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fish className="h-5 w-5" />
          Guias de Pesca
        </CardTitle>
        <CardDescription>
          Gerencie todos os guias de pesca cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {guides.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum guia de pesca cadastrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Região</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">{guide.full_name}</TableCell>
                  <TableCell>{guide.email}</TableCell>
                  <TableCell>{guide.phone}</TableCell>
                  <TableCell>{safeJoinArray(guide.service_areas)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      guide.approval_status === "approved" ? "default" : 
                      guide.approval_status === "pending" ? "secondary" : 
                      "destructive"
                    }>
                      {guide.approval_status === "approved" ? "Aprovado" : 
                       guide.approval_status === "pending" ? "Pendente" : 
                       "Rejeitado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(guide.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingGuide(guide)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Guia</DialogTitle>
                            <DialogDescription>
                              Informações completas do cadastro
                            </DialogDescription>
                          </DialogHeader>
                          {viewingGuide && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Nome Completo</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.full_name}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">CPF</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.cpf}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Data de Nascimento</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(viewingGuide.birth_date).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Telefone</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.phone}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Email</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.email}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Anos de Experiência</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.experience_years} anos</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-semibold">Endereço</Label>
                                <p className="text-sm text-muted-foreground">{viewingGuide.address}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Cidade</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.city}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Estado</Label>
                                  <p className="text-sm text-muted-foreground">{viewingGuide.state}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="font-semibold">Especialidades</Label>
                                <p className="text-sm text-muted-foreground">
                                  {safeJoinArray(viewingGuide.specialties)}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Idiomas</Label>
                                <p className="text-sm text-muted-foreground">
                                  {safeJoinArray(viewingGuide.languages)}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Certificações</Label>
                                <p className="text-sm text-muted-foreground">
                                  {viewingGuide.certifications || "Não informado"}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Disponibilidade</Label>
                                <p className="text-sm text-muted-foreground">{viewingGuide.availability}</p>
                              </div>

                              <div>
                                <Label className="font-semibold">Áreas de Atendimento</Label>
                                <p className="text-sm text-muted-foreground">
                                  {safeJoinArray(viewingGuide.service_areas)}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Equipamentos</Label>
                                <p className="text-sm text-muted-foreground">{viewingGuide.equipment_list}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Preço Meio Dia</Label>
                                  <p className="text-sm text-muted-foreground">
                                    R$ {viewingGuide.half_day_price?.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Preço Dia Completo</Label>
                                  <p className="text-sm text-muted-foreground">
                                    R$ {viewingGuide.full_day_price?.toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label className="font-semibold">Serviços Adicionais</Label>
                                <p className="text-sm text-muted-foreground">
                                  {viewingGuide.additional_services || "Não informado"}
                                </p>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  className="flex-1"
                                  onClick={() => {
                                    handleApproveGuide(guide.id);
                                    setViewingGuide(null);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aprovar
                                </Button>
                                <Button
                                  className="flex-1"
                                  variant="destructive"
                                  onClick={() => {
                                    handleRejectGuide(guide.id);
                                    setViewingGuide(null);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
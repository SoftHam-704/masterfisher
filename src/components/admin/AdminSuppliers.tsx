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
import { CheckCircle, Eye, Building2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  cnpj: string;
  responsible_name: string;
  responsible_cpf: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  category: string;
  description: string;
  products_services: string;
  operating_hours: string | null;
  payment_methods: string[];
  delivery_options: string | null;
  approval_status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const { data: allSuppliers } = await (supabase as any)
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });

    if (allSuppliers) setSuppliers(allSuppliers as any);
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

  const handleApproveSupplier = async (supplierId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: supplier } = await (supabase as any)
      .from("suppliers")
      .select("responsible_name, email")
      .eq("id", supplierId)
      .single();
    
    const { error } = await (supabase as any)
      .from("suppliers")
      .update({
        approval_status: "approved",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o fornecedor.",
        variant: "destructive",
      });
      return;
    }

    if (supplier?.email) {
      await supabase.functions.invoke("send-approval-email", {
        body: {
          email: supplier.email,
          name: supplier.responsible_name,
          type: "supplier",
          status: "approved"
        }
      });
    }

    toast({
      title: "Fornecedor Aprovado",
      description: "O fornecedor foi aprovado e notificado por email.",
    });

    loadSuppliers();
  };

  const handleRejectSupplier = async (supplierId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: supplier } = await (supabase as any)
      .from("suppliers")
      .select("responsible_name, email")
      .eq("id", supplierId)
      .single();
    
    const reason = prompt("Digite o motivo da rejeição (opcional):");
    
    const { error } = await (supabase as any)
      .from("suppliers")
      .update({
        approval_status: "rejected",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", supplierId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o fornecedor.",
        variant: "destructive",
      });
      return;
    }

    if (supplier?.email) {
      await supabase.functions.invoke("send-approval-email", {
        body: {
          email: supplier.email,
          name: supplier.responsible_name,
          type: "supplier",
          status: "rejected",
          reason: reason || undefined
        }
      });
    }

    toast({
      title: "Fornecedor Rejeitado",
      description: "O fornecedor foi rejeitado e notificado por email.",
      variant: "destructive",
    });

    loadSuppliers();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Fornecedores
        </CardTitle>
        <CardDescription>
          Gerencie todos os fornecedores cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suppliers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum fornecedor cadastrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.company_name}</TableCell>
                  <TableCell>{supplier.responsible_name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{supplier.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      supplier.approval_status === "approved" ? "default" : 
                      supplier.approval_status === "pending" ? "secondary" : 
                      "destructive"
                    }>
                      {supplier.approval_status === "approved" ? "Aprovado" : 
                       supplier.approval_status === "pending" ? "Pendente" : 
                       "Rejeitado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(supplier.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingSupplier(supplier)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Fornecedor</DialogTitle>
                            <DialogDescription>
                              Informações completas do cadastro
                            </DialogDescription>
                          </DialogHeader>
                          {viewingSupplier && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Nome da Empresa</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.company_name}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">CNPJ</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.cnpj}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Nome do Responsável</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.responsible_name}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">CPF do Responsável</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.responsible_cpf}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Telefone</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.phone}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Email</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.email}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="font-semibold">Endereço</Label>
                                <p className="text-sm text-muted-foreground">{viewingSupplier.address}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Cidade</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.city}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Estado</Label>
                                  <p className="text-sm text-muted-foreground">{viewingSupplier.state}</p>
                                </div>
                              </div>

                              <div>
                                <Label className="font-semibold">Categoria</Label>
                                <p className="text-sm text-muted-foreground">{viewingSupplier.category}</p>
                              </div>

                              <div>
                                <Label className="font-semibold">Descrição</Label>
                                <p className="text-sm text-muted-foreground">{viewingSupplier.description}</p>
                              </div>

                              <div>
                                <Label className="font-semibold">Produtos/Serviços</Label>
                                <p className="text-sm text-muted-foreground">{viewingSupplier.products_services}</p>
                              </div>

                              <div>
                                <Label className="font-semibold">Horário de Funcionamento</Label>
                                <p className="text-sm text-muted-foreground">
                                  {viewingSupplier.operating_hours || "Não informado"}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Formas de Pagamento</Label>
                                <p className="text-sm text-muted-foreground">
                                  {safeJoinArray(viewingSupplier.payment_methods)}
                                </p>
                              </div>

                              <div>
                                <Label className="font-semibold">Opções de Entrega</Label>
                                <p className="text-sm text-muted-foreground">
                                  {viewingSupplier.delivery_options || "Não informado"}
                                </p>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  className="flex-1"
                                  onClick={() => {
                                    handleApproveSupplier(supplier.id);
                                    setViewingSupplier(null);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aprovar
                                </Button>
                                <Button
                                  className="flex-1"
                                  variant="destructive"
                                  onClick={() => {
                                    handleRejectSupplier(supplier.id);
                                    setViewingSupplier(null);
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
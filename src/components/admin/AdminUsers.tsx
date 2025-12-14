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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  display_name: string | null;
  phone: string | null;
  bio: string | null;
  approval_status: string;
  user_type: string | null;
  created_at: string;
  avatar_url: string | null;
}

export const AdminUsers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data: users } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (users) setAllUsers(users);
    setLoading(false);
  };

  const handleUpdateProfile = async (profile: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: profile.display_name,
        phone: profile.phone,
        bio: profile.bio,
        user_type: profile.user_type,
      })
      .eq("id", profile.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil Atualizado",
      description: "As alterações foram salvas com sucesso.",
    });

    setEditingProfile(null);
    loadUsers();
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", profileId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o perfil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil Excluído",
      description: "O usuário foi removido do sistema.",
    });

    loadUsers();
  };

  const renderProfileTable = (profiles: Profile[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell className="font-medium">
              {profile.display_name || "Sem nome"}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {profile.user_type === "guide" ? "Guia" : profile.user_type === "partner" ? "Parceiro" : "Usuário"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={
                profile.approval_status === "approved" ? "default" : 
                profile.approval_status === "pending" ? "secondary" : 
                "destructive"
              }>
                {profile.approval_status === "approved" ? "Aprovado" : 
                 profile.approval_status === "pending" ? "Pendente" : 
                 "Rejeitado"}
              </Badge>
            </TableCell>
            <TableCell>{profile.phone || "-"}</TableCell>
            <TableCell>
              {new Date(profile.created_at).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProfile(profile)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                      <DialogDescription>
                        Faça alterações no perfil do usuário
                      </DialogDescription>
                    </DialogHeader>
                    {editingProfile && (
                      <div className="space-y-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={editingProfile.display_name || ""}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                display_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Telefone</Label>
                          <Input
                            value={editingProfile.phone || ""}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Biografia</Label>
                          <Input
                            value={editingProfile.bio || ""}
                            onChange={(e) =>
                              setEditingProfile({
                                ...editingProfile,
                                bio: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          onClick={() => handleUpdateProfile(editingProfile)}
                          className="w-full"
                        >
                          Salvar Alterações
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteProfile(profile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Todos os Usuários
        </CardTitle>
        <CardDescription>
          Visualize, edite e gerencie todos os usuários do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : allUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário cadastrado
          </div>
        ) : (
          renderProfileTable(allUsers)
        )}
      </CardContent>
    </Card>
  );
};
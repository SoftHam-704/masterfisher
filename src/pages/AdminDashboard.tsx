import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle, 
  XCircle,
  Clock,
  Pencil,
  Trash2,
  UserCheck,
  Building2,
  Fish,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GeneratePartnerLogos } from "@/components/GeneratePartnerLogos";

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

interface Statistics {
  total_users: number;
  pending_users: number;
  total_guides: number;
  total_partners: number;
  total_bookings: number;
  pending_bookings: number;
  total_reviews: number;
  pending_guides: number;
  pending_suppliers: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pendingProfiles, setPendingProfiles] = useState<Profile[]>([]);
  const [pendingGuides, setPendingGuides] = useState<Guide[]>([]);
  const [pendingSuppliers, setPendingSuppliers] = useState<Supplier[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [viewingGuide, setViewingGuide] = useState<Guide | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [stats, setStats] = useState<Statistics>({
    total_users: 0,
    pending_users: 0,
    total_guides: 0,
    total_partners: 0,
    total_bookings: 0,
    pending_bookings: 0,
    total_reviews: 0,
    pending_guides: 0,
    pending_suppliers: 0,
  });

  // Helper function to safely join array values
  const safeJoinArray = (value: any): string => {
    if (!value) return 'Não informado';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(', ');
        return value;
      } catch {
        return value;
      }
    }
    return 'Não informado';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkSupervisor();
  }, []);

  const checkSupervisor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'supervisor')
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Acesso Negado",
          description: "Apenas supervisores podem acessar este painel.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsSupervisor(true);
      loadData();
    } finally {
      setAuthChecking(false);
    }
  };

  const loadData = async () => {
    setLoading(true);

    // Carregar perfis pendentes
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (profiles) setPendingProfiles(profiles);

    // Carregar guias pendentes
    const { data: pendingGuidesData } = await (supabase as any)
      .from('guides')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (pendingGuidesData) setPendingGuides(pendingGuidesData as any);

    // Carregar fornecedores pendentes
    const { data: pendingSuppliersData } = await (supabase as any)
      .from('suppliers')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    if (pendingSuppliersData) setPendingSuppliers(pendingSuppliersData as any);

    // Carregar todos os usuários
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (users) setAllUsers(users);

    // Carregar todos os guias
    const { data: allGuides } = await (supabase as any)
      .from('guides')
      .select('*')
      .order('created_at', { ascending: false });

    if (allGuides) setGuides(allGuides as any);

    // Carregar todos os fornecedores
    const { data: allSuppliers } = await (supabase as any)
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    if (allSuppliers) setSuppliers(allSuppliers as any);

    // Carregar estatísticas
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: pendingUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    const { count: totalGuides } = await (supabase as any)
      .from('guides')
      .select('*', { count: 'exact', head: true });

    const { count: totalPartners } = await (supabase as any)
      .from('suppliers')
      .select('*', { count: 'exact', head: true });

    const { count: pendingGuidesCount } = await (supabase as any)
      .from('guides')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    const { count: pendingSuppliersCount } = await (supabase as any)
      .from('suppliers')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: totalReviews } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    setStats({
      total_users: totalUsers || 0,
      pending_users: pendingUsers || 0,
      total_guides: totalGuides || 0,
      total_partners: totalPartners || 0,
      total_bookings: totalBookings || 0,
      pending_bookings: pendingBookings || 0,
      total_reviews: totalReviews || 0,
      pending_guides: pendingGuidesCount || 0,
      pending_suppliers: pendingSuppliersCount || 0,
    });

    setLoading(false);
  };

  const handleApproveProfile = async (profileId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        approval_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o perfil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil Aprovado",
      description: "O perfil foi aprovado com sucesso.",
    });

    loadData();
  };

  const handleRejectProfile = async (profileId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({
        approval_status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', profileId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o perfil.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil Rejeitado",
      description: "O perfil foi rejeitado.",
      variant: "destructive",
    });

    loadData();
  };

  const handleUpdateProfile = async (profile: Profile) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: profile.display_name,
        phone: profile.phone,
        bio: profile.bio,
        user_type: profile.user_type,
      })
      .eq('id', profile.id);

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
    loadData();
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

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

    loadData();
  };

  const handleApproveGuide = async (guideId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar dados do guia
    const { data: guide } = await (supabase as any)
      .from('guides')
      .select('full_name, email')
      .eq('id', guideId)
      .single();
    
    const { error } = await (supabase as any)
      .from('guides')
      .update({
        approval_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', guideId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o guia.",
        variant: "destructive",
      });
      return;
    }

    // Enviar email de aprovação
    if (guide?.email) {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email: guide.email,
          name: guide.full_name,
          type: 'guide',
          status: 'approved'
        }
      });
    }

    toast({
      title: "Guia Aprovado",
      description: "O guia foi aprovado e notificado por email.",
    });

    loadData();
  };

  const handleRejectGuide = async (guideId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar dados do guia
    const { data: guide } = await (supabase as any)
      .from('guides')
      .select('full_name, email')
      .eq('id', guideId)
      .single();
    
    // Solicitar motivo da rejeição
    const reason = prompt("Digite o motivo da rejeição (opcional):");
    
    const { error } = await (supabase as any)
      .from('guides')
      .update({
        approval_status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', guideId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o guia.",
        variant: "destructive",
      });
      return;
    }

    // Enviar email de rejeição
    if (guide?.email) {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email: guide.email,
          name: guide.full_name,
          type: 'guide',
          status: 'rejected',
          reason: reason || undefined
        }
      });
    }

    toast({
      title: "Guia Rejeitado",
      description: "O guia foi rejeitado e notificado por email.",
      variant: "destructive",
    });

    loadData();
  };

  const handleApproveSupplier = async (supplierId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar dados do fornecedor
    const { data: supplier } = await (supabase as any)
      .from('suppliers')
      .select('responsible_name, email')
      .eq('id', supplierId)
      .single();
    
    const { error } = await (supabase as any)
      .from('suppliers')
      .update({
        approval_status: 'approved',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', supplierId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o fornecedor.",
        variant: "destructive",
      });
      return;
    }

    // Enviar email de aprovação
    if (supplier?.email) {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email: supplier.email,
          name: supplier.responsible_name,
          type: 'supplier',
          status: 'approved'
        }
      });
    }

    toast({
      title: "Fornecedor Aprovado",
      description: "O fornecedor foi aprovado e notificado por email.",
    });

    loadData();
  };

  const handleRejectSupplier = async (supplierId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Buscar dados do fornecedor
    const { data: supplier } = await (supabase as any)
      .from('suppliers')
      .select('responsible_name, email')
      .eq('id', supplierId)
      .single();
    
    // Solicitar motivo da rejeição
    const reason = prompt("Digite o motivo da rejeição (opcional):");
    
    const { error } = await (supabase as any)
      .from('suppliers')
      .update({
        approval_status: 'rejected',
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', supplierId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o fornecedor.",
        variant: "destructive",
      });
      return;
    }

    // Enviar email de rejeição
    if (supplier?.email) {
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email: supplier.email,
          name: supplier.responsible_name,
          type: 'supplier',
          status: 'rejected',
          reason: reason || undefined
        }
      });
    }

    toast({
      title: "Fornecedor Rejeitado",
      description: "O fornecedor foi rejeitado e notificado por email.",
      variant: "destructive",
    });

    loadData();
  };

  const renderProfileTable = (profiles: Profile[], showActions: boolean = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Cadastro</TableHead>
          {showActions && <TableHead>Ações</TableHead>}
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
                {profile.user_type === 'guide' ? 'Guia' : profile.user_type === 'partner' ? 'Parceiro' : 'Usuário'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={
                profile.approval_status === 'approved' ? 'default' : 
                profile.approval_status === 'pending' ? 'secondary' : 
                'destructive'
              }>
                {profile.approval_status === 'approved' ? 'Aprovado' : 
                 profile.approval_status === 'pending' ? 'Pendente' : 
                 'Rejeitado'}
              </Badge>
            </TableCell>
            <TableCell>{profile.phone || "-"}</TableCell>
            <TableCell>
              {new Date(profile.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            {showActions && (
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
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (authChecking || !isSupervisor || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Painel do Supervisor</h1>
              <p className="text-muted-foreground">Gerencie usuários, aprovações e dados do sistema</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <XCircle className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Fish className="h-4 w-4 text-blue-500" />
                Guias de Pesca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total_guides}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-500" />
                Parceiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.total_partners}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Solicitações Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending_guides + stats.pending_suppliers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">
              Solicitações ({pendingGuides.length + pendingSuppliers.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Usuários ({allUsers.length})
            </TabsTrigger>
            <TabsTrigger value="guides">
              Guias ({guides.length})
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              Fornecedores ({suppliers.length})
            </TabsTrigger>
            <TabsTrigger value="partners">
              Parceiros Master
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Pendentes</CardTitle>
                <CardDescription>
                  Aprove ou rejeite novos cadastros de guias e fornecedores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {pendingGuides.length === 0 && pendingSuppliers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma solicitação pendente
                  </div>
                ) : (
                  <>
                    {/* Guias Pendentes */}
                    {pendingGuides.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Fish className="h-5 w-5 text-blue-500" />
                          Guias de Pesca ({pendingGuides.length})
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nome</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Telefone</TableHead>
                              <TableHead>Cidade/Estado</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingGuides.map((guide) => (
                              <TableRow key={guide.id}>
                                <TableCell className="font-medium">
                                  {guide.full_name}
                                </TableCell>
                                <TableCell>{guide.email}</TableCell>
                                <TableCell>{guide.phone}</TableCell>
                                <TableCell>
                                  {guide.city}/{guide.state}
                                </TableCell>
                                <TableCell>
                                  {new Date(guide.created_at).toLocaleDateString('pt-BR')}
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
                                                  {new Date(viewingGuide.birth_date).toLocaleDateString('pt-BR')}
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
                                                {viewingGuide.certifications || 'Não informado'}
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
                                                {viewingGuide.additional_services || 'Não informado'}
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
                      </div>
                    )}

                    {/* Fornecedores Pendentes */}
                    {pendingSuppliers.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-purple-500" />
                          Fornecedores ({pendingSuppliers.length})
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Empresa</TableHead>
                              <TableHead>Responsável</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Telefone</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingSuppliers.map((supplier) => (
                              <TableRow key={supplier.id}>
                                <TableCell className="font-medium">
                                  {supplier.company_name}
                                </TableCell>
                                <TableCell>{supplier.responsible_name}</TableCell>
                                <TableCell>{supplier.email}</TableCell>
                                <TableCell>{supplier.phone}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{supplier.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(supplier.created_at).toLocaleDateString('pt-BR')}
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
                                                {viewingSupplier.operating_hours || 'Não informado'}
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
                                                {viewingSupplier.delivery_options || 'Não informado'}
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
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
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
                {allUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum usuário cadastrado
                  </div>
                ) : (
                  renderProfileTable(allUsers)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
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
                              guide.approval_status === 'approved' ? 'default' : 
                              guide.approval_status === 'pending' ? 'secondary' : 
                              'destructive'
                            }>
                              {guide.approval_status === 'approved' ? 'Aprovado' : 
                               guide.approval_status === 'pending' ? 'Pendente' : 
                               'Rejeitado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(guide.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
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
                              supplier.approval_status === 'approved' ? 'default' : 
                              supplier.approval_status === 'pending' ? 'secondary' : 
                              'destructive'
                            }>
                              {supplier.approval_status === 'approved' ? 'Aprovado' : 
                               supplier.approval_status === 'pending' ? 'Pendente' : 
                               'Rejeitado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(supplier.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partners">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Parceiros Master</CardTitle>
                  <CardDescription>
                    Gere logos profissionais com IA para os parceiros premium
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneratePartnerLogos />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-primary text-primary-foreground py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 MasterFisher. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
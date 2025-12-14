import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    CheckCircle, 
    XCircle, 
    Eye, 
    Loader2, 
    Trophy, 
    Crown,
    ExternalLink,
    Instagram,
    Facebook,
    Youtube,
    Globe
} from "lucide-react";

interface Partner {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    area: string | null;
    plan_type: string;
    amount: number;
    payment_status: string;
    logo_url: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    youtube_url: string | null;
    website_url: string | null;
    created_at: string;
}

export const AdminPartners = () => {
    const { toast } = useToast();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('partner_payments')
                .select('*')
                .in('plan_type', ['gold', 'master'])
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPartners(data || []);
        } catch (error) {
            console.error('Erro ao buscar parceiros:', error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os parceiros.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updatePartnerStatus = async (partnerId: string, newStatus: string) => {
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('partner_payments')
                .update({ payment_status: newStatus })
                .eq('id', partnerId);

            if (error) throw error;

            toast({
                title: "Sucesso!",
                description: `Status atualizado para "${newStatus}".`
            });

            fetchPartners();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o status.",
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
            'pending': { variant: 'outline', label: 'Pendente' },
            'pending_negotiation': { variant: 'secondary', label: 'Aguardando Negociação' },
            'approved': { variant: 'default', label: 'Aprovado' },
            'active': { variant: 'default', label: 'Ativo' },
            'paid': { variant: 'default', label: 'Pago' },
            'rejected': { variant: 'destructive', label: 'Rejeitado' },
            'cancelled': { variant: 'destructive', label: 'Cancelado' },
            'succeeded': { variant: 'default', label: 'Ativo' },
        };

        const config = statusConfig[status] || { variant: 'outline' as const, label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getPlanBadge = (planType: string) => {
        if (planType === 'master') {
            return (
                <Badge className="bg-purple-600 hover:bg-purple-700">
                    <Crown className="w-3 h-3 mr-1" />
                    Master
                </Badge>
            );
        }
        return (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
                <Trophy className="w-3 h-3 mr-1" />
                Gold
            </Badge>
        );
    };

    const filteredPartners = partners.filter(partner => {
        if (filterType !== 'all' && partner.plan_type !== filterType) return false;
        if (filterStatus !== 'all' && partner.payment_status !== filterStatus) return false;
        return true;
    });

    const pendingMasterCount = partners.filter(
        p => p.plan_type === 'master' && p.payment_status === 'pending_negotiation'
    ).length;

    return (
        <div className="space-y-6">
            {/* Alert for pending Master partners */}
            {pendingMasterCount > 0 && (
                <Card className="border-purple-500 bg-purple-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <Crown className="w-6 h-6 text-purple-500" />
                            <div>
                                <p className="font-semibold text-purple-700">
                                    {pendingMasterCount} parceiro(s) Master aguardando negociação
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Revise as solicitações e aprove após fechar negociação
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Parceiros</CardTitle>
                    <CardDescription>
                        Gerencie parceiros Gold e Master, aprove solicitações e atualize status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                        <div className="w-48">
                            <Label>Tipo de Plano</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="gold">Gold</SelectItem>
                                    <SelectItem value="master">Master</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-48">
                            <Label>Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="pending_negotiation">Aguardando Negociação</SelectItem>
                                    <SelectItem value="approved">Aprovado</SelectItem>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="paid">Pago</SelectItem>
                                    <SelectItem value="rejected">Rejeitado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredPartners.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum parceiro encontrado
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empresa</TableHead>
                                    <TableHead>Contato</TableHead>
                                    <TableHead>Plano</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPartners.map((partner) => (
                                    <TableRow key={partner.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {partner.logo_url ? (
                                                    <img 
                                                        src={partner.logo_url} 
                                                        alt={partner.company || ''} 
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                        <span className="text-lg font-bold">
                                                            {(partner.company || partner.name).charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{partner.company || '-'}</p>
                                                    <p className="text-sm text-muted-foreground">{partner.area || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{partner.name}</p>
                                            <p className="text-sm text-muted-foreground">{partner.email}</p>
                                        </TableCell>
                                        <TableCell>{getPlanBadge(partner.plan_type)}</TableCell>
                                        <TableCell>{getStatusBadge(partner.payment_status)}</TableCell>
                                        <TableCell>
                                            {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedPartner(partner);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Ver
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Detalhes do Parceiro
                            {selectedPartner && getPlanBadge(selectedPartner.plan_type)}
                        </DialogTitle>
                        <DialogDescription>
                            Visualize e gerencie as informações do parceiro
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPartner && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Empresa</Label>
                                    <p className="font-medium">{selectedPartner.company || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Área de Atuação</Label>
                                    <p className="font-medium">{selectedPartner.area || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Nome do Contato</Label>
                                    <p className="font-medium">{selectedPartner.name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium">{selectedPartner.email}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Telefone</Label>
                                    <p className="font-medium">{selectedPartner.phone || '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Valor</Label>
                                    <p className="font-medium">
                                        {selectedPartner.amount > 0 
                                            ? `R$ ${selectedPartner.amount.toFixed(2)}` 
                                            : 'Sob negociação'}
                                    </p>
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div>
                                <Label className="text-muted-foreground mb-2 block">Redes Sociais</Label>
                                <div className="flex gap-3">
                                    {selectedPartner.instagram_url && (
                                        <a href={selectedPartner.instagram_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Instagram className="w-4 h-4 mr-1" />
                                                Instagram
                                            </Button>
                                        </a>
                                    )}
                                    {selectedPartner.facebook_url && (
                                        <a href={selectedPartner.facebook_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Facebook className="w-4 h-4 mr-1" />
                                                Facebook
                                            </Button>
                                        </a>
                                    )}
                                    {selectedPartner.youtube_url && (
                                        <a href={selectedPartner.youtube_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Youtube className="w-4 h-4 mr-1" />
                                                YouTube
                                            </Button>
                                        </a>
                                    )}
                                    {selectedPartner.website_url && (
                                        <a href={selectedPartner.website_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm">
                                                <Globe className="w-4 h-4 mr-1" />
                                                Website
                                            </Button>
                                        </a>
                                    )}
                                    {!selectedPartner.instagram_url && !selectedPartner.facebook_url && 
                                     !selectedPartner.youtube_url && !selectedPartner.website_url && (
                                        <span className="text-muted-foreground text-sm">Nenhuma rede social informada</span>
                                    )}
                                </div>
                            </div>

                            {/* Logo */}
                            {selectedPartner.logo_url && (
                                <div>
                                    <Label className="text-muted-foreground mb-2 block">Logo</Label>
                                    <img 
                                        src={selectedPartner.logo_url} 
                                        alt="Logo" 
                                        className="w-32 h-32 object-cover rounded-lg border"
                                    />
                                </div>
                            )}

                            {/* Status Update */}
                            <div className="border-t pt-4">
                                <Label className="text-muted-foreground mb-2 block">Atualizar Status</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        disabled={isUpdating || selectedPartner.payment_status === 'active'}
                                        onClick={() => updatePartnerStatus(selectedPartner.id, 'active')}
                                    >
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                                        Ativar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        disabled={isUpdating || selectedPartner.payment_status === 'approved'}
                                        onClick={() => updatePartnerStatus(selectedPartner.id, 'approved')}
                                    >
                                        Aprovar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isUpdating || selectedPartner.payment_status === 'rejected'}
                                        onClick={() => updatePartnerStatus(selectedPartner.id, 'rejected')}
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Rejeitar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
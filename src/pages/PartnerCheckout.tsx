import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import LogoUpload from "@/components/LogoUpload";
import { Check, Loader2, Star, Trophy, Award, Handshake, Smartphone, Users, Megaphone, DollarSign, TrendingUp, Globe, MapPin } from "lucide-react";
import heroFishing from "@/assets/hero-fishing.jpg";
import guideService from "@/assets/guide-service.jpg";
import supplierService from "@/assets/supplier-service.jpg";

export default function PartnerCheckout() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [planType, setPlanType] = useState<'gold' | 'master'>('gold');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        area: '',
        instagram_url: '',
        facebook_url: '',
        youtube_url: '',
        website_url: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Para plano Master, salva diretamente no banco sem pagamento
            if (planType === 'master') {
                const { error } = await supabase
                    .from('partner_payments')
                    .insert({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        company: formData.company,
                        area: formData.area,
                        plan_type: 'master',
                        amount: 0,
                        payment_status: 'pending_negotiation',
                        logo_url: logoUrl,
                        instagram_url: formData.instagram_url || null,
                        facebook_url: formData.facebook_url || null,
                        youtube_url: formData.youtube_url || null,
                        website_url: formData.website_url || null
                    });

                if (error) throw error;

                toast({
                    title: 'Solicitação enviada!',
                    description: 'Entraremos em contato para negociação do plano Master. Obrigado pelo interesse!'
                });
                navigate('/');
                return;
            }

            // Para plano Gold, segue fluxo normal com pagamento
            const amount = 559; // Parceiro Gold: R$ 559

            const { data, error } = await supabase.functions.invoke('create-mercadopago-checkout', {
                body: {
                    ...formData,
                    planType,
                    logoUrl,
                    amount,
                    origin: window.location.origin
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.open(data.url, '_blank');
                toast({
                    title: "Redirecionando para pagamento",
                    description: "Uma nova aba foi aberta com o checkout do Mercado Pago."
                });
            } else {
                throw new Error('URL de checkout não retornada');
            }
        } catch (error: any) {
            console.error('Erro ao processar:', error);
            toast({
                title: "Erro ao processar",
                description: error.message || "Não foi possível processar sua solicitação.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const plans = [
        {
            id: 'gold',
            name: 'Gold',
            price: 559,
            icon: Trophy,
            color: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            popular: true,
            features: [
                'goldFeature1',
                'goldFeature2',
                'goldFeature3',
                'goldFeature4',
                'goldFeature5',
                'goldFeature6',
                'goldFeature7'
            ]
        },
        {
            id: 'master',
            name: 'Master',
            price: null,
            icon: Handshake,
            color: 'text-purple-600',
            borderColor: 'border-purple-600',
            premium: true,
            features: [
                'masterFeature1',
                'masterFeature2',
                'masterFeature3',
                'masterFeature4',
                'masterFeature5',
                'masterFeature6',
                'masterFeature7',
                'masterFeature8'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src={heroFishing}
                    alt="Pesca profissional"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                {t('partnerCheckout.title')}
                            </h1>
                            <p className="text-xl text-white/90">
                                {t('partnerCheckout.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is MasterFisher Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">{t('partnerCheckout.solutionTitle')}</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            {t('partnerCheckout.solutionDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Handshake className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('partnerCheckout.secureConnection')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('partnerCheckout.secureConnectionDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('partnerCheckout.intuitiveTools')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('partnerCheckout.intuitiveToolsDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Megaphone className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('partnerCheckout.freePromotion')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('partnerCheckout.freePromotionDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('partnerCheckout.monetization')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('partnerCheckout.monetizationDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center max-w-4xl mx-auto">
                        <p className="text-2xl font-semibold italic">
                            "{t('partnerCheckout.quote')}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Market Growth Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">{t('partnerCheckout.marketGrowthTitle')}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="h-8 w-8 text-primary" />
                                <CardTitle className="text-2xl">{t('partnerCheckout.globalMarket')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    O turismo de pesca representa uma indústria colossal, estimada em <span className="font-bold text-primary">20 bilhões de dólares</span> anualmente
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    O mercado global de equipamentos de pesca é avaliado em <span className="font-bold text-primary">23,8 bilhões de dólares</span> em 2021
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    Taxa de crescimento anual (CAGR) de <span className="font-bold text-primary">4,2%</span> até 2028
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="h-8 w-8 text-primary" />
                                <CardTitle className="text-2xl">{t('partnerCheckout.brazilianMarket')}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    O Brasil possui <span className="font-bold text-primary">202 destinos</span> dedicadas à pescarias em <span className="font-bold text-primary">18 estados</span>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    Apóia-se a <span className="font-bold text-primary">9 milhões</span> de pescadores e gera mais de <span className="font-bold text-primary">200 mil empregos</span>
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <DollarSign className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                                <p className="text-sm">
                                    Receita anual estimada entre <span className="font-bold text-primary">2 bilhões e 17 bilhões</span> de reais
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Crescimento Anual</p>
                            <p className="text-4xl font-bold text-primary mb-2">30-40%</p>
                            <p className="text-xs text-muted-foreground">nas últimas duas anos</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Turismo de Aventura</p>
                            <p className="text-4xl font-bold text-primary mb-2">47%</p>
                            <p className="text-xs text-muted-foreground">crescimento de vendas em um ano</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Previsão de Mercado</p>
                            <p className="text-4xl font-bold text-primary mb-2">US$ 31,84 bi</p>
                            <p className="text-xs text-muted-foreground">de equipamentos de pesca até 2028</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <Trophy className="h-8 w-8" />
                        <p className="text-xl font-bold">
                            O Brasil foi nomeado melhor país do mundo para turismo de aventura em 2024
                        </p>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t('partnerCheckout.whyPartner')}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t('partnerCheckout.whyPartnerDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="overflow-hidden">
                            <img
                                src={guideService}
                                alt="Serviço de guia"
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">{t('partnerCheckout.forGuides')}</h3>
                                <p className="text-muted-foreground">
                                    {t('partnerCheckout.forGuidesDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <img
                                src={supplierService}
                                alt="Serviço de fornecedor"
                                className="w-full h-48 object-cover"
                            />
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-bold mb-2">{t('partnerCheckout.forSuppliers')}</h3>
                                <p className="text-muted-foreground">
                                    {t('partnerCheckout.forSuppliersDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Plans Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">{t('partnerCheckout.choosePlan')}</h2>
                        <p className="text-lg text-muted-foreground">
                            {t('partnerCheckout.choosePlanDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            const isMasterPlan = plan.id === 'master';
                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative ${planType === plan.id ? `border-2 ${plan.borderColor}` : ''} ${plan.popular ? 'shadow-lg scale-105' : ''} ${plan.premium ? 'shadow-xl border-2 border-purple-600' : ''}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                            {t('partnerCheckout.mostPopular')}
                                        </div>
                                    )}
                                    {plan.premium && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            🏆 Premium
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <Icon className={`h-12 w-12 mx-auto mb-4 ${plan.color}`} />
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        <div className="text-4xl font-bold mt-4">
                                            {isMasterPlan ? (
                                                <>
                                                    <span className="text-2xl">Sob consulta</span>
                                                    <p className="text-sm font-normal text-muted-foreground mt-2">
                                                        Preencha o formulário abaixo
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    R$ {plan.price}
                                                    <span className="text-base font-normal text-muted-foreground">/ano</span>
                                                </>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <Check className={`mr-2 h-5 w-5 mt-0.5 flex-shrink-0 ${plan.color}`} />
                                                    <span className="text-sm">{t(`partnerCheckout.${feature}`)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {isMasterPlan ? (
                                            <Button
                                                variant={planType === 'master' ? "default" : "outline"}
                                                className={`w-full ${planType === 'master' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                                                onClick={() => setPlanType('master')}
                                            >
                                                {planType === 'master' ? t('partnerCheckout.planSelected') : 'Selecionar Master'}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={planType === plan.id ? "default" : "outline"}
                                                className="w-full"
                                                onClick={() => setPlanType(plan.id as 'gold')}
                                            >
                                                {planType === plan.id ? t('partnerCheckout.planSelected') : t('partnerCheckout.selectPlan')}
                                            </Button>
                                        )}
                                        <div className="mt-4 text-center">
                                            <a
                                                href={isMasterPlan ? "/patrocinadormaster" : "/patrocinadores"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {isMasterPlan ? "Por que ser Parceiro Master?" : "Por que ser Parceiro Gold?"}
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Form Section */}
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('partnerCheckout.registrationInfo')}</CardTitle>
                            <CardDescription>
                                {t('partnerCheckout.completeData')} {plans.find(p => p.id === planType)?.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-muted p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">Plano Selecionado</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {plans.find(p => p.id === planType)?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Valor anual</p>
                                            <p className="text-3xl font-bold">
                                                {planType === 'master' ? 'Sob consulta' : `R$ ${plans.find(p => p.id === planType)?.price}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('partnerCheckout.name')} *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={t('partnerCheckout.name')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('partnerCheckout.email')} *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={t('partnerCheckout.email')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('partnerCheckout.phone')}</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder={t('partnerCheckout.phone')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">{t('partnerCheckout.company')} *</Label>
                                        <Input
                                            id="company"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Nome da empresa"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="area">{t('partnerCheckout.area')} *</Label>
                                        <Input
                                            id="area"
                                            required
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            placeholder={t('partnerCheckout.area')}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label>{t('partnerCheckout.logoUploadTitle')}</Label>
                                        <LogoUpload
                                            onUploadComplete={(url) => setLogoUrl(url)}
                                            currentLogoUrl={logoUrl}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {t('partnerCheckout.logoRequirements')}
                                        </p>
                                    </div>

                                    {/* Redes Sociais */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-base font-semibold">Redes Sociais (opcional)</Label>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="instagram_url">Instagram</Label>
                                        <Input
                                            id="instagram_url"
                                            type="url"
                                            value={formData.instagram_url}
                                            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                            placeholder="https://instagram.com/suaempresa"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="facebook_url">Facebook</Label>
                                        <Input
                                            id="facebook_url"
                                            type="url"
                                            value={formData.facebook_url}
                                            onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                            placeholder="https://facebook.com/suaempresa"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="youtube_url">YouTube</Label>
                                        <Input
                                            id="youtube_url"
                                            type="url"
                                            value={formData.youtube_url}
                                            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                            placeholder="https://youtube.com/@seucanal"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website_url">Website</Label>
                                        <Input
                                            id="website_url"
                                            type="url"
                                            value={formData.website_url}
                                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                            placeholder="https://seusite.com.br"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('common.loading')}...
                                        </>
                                    ) : planType === 'master' ? (
                                        'Enviar Solicitação Master'
                                    ) : (
                                        `${t('partnerCheckout.submit')} ${plans.find(p => p.id === planType)?.name} - R$ ${plans.find(p => p.id === planType)?.price}/ano`
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
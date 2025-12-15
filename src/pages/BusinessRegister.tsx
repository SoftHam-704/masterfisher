import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { TermsOfUseAcceptance } from "@/components/TermsOfUseAcceptance";
import { Check, Loader2, Sparkles, TrendingUp, Users, MapPin, Award } from "lucide-react";
import supplierService from "@/assets/supplier-service.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

type PlanType = 'annual';

export default function BusinessRegister() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('annual');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        businessType: '',
        location: '',
        instagram_url: '',
        facebook_url: '',
        youtube_url: '',
        website_url: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast({
                title: "Termos não aceitos",
                description: "É necessário aceitar os Termos de Uso para continuar.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            // Always annual plan now
            const amount = 958.80;
            const { data, error } = await supabase.functions.invoke('create-mercadopago-checkout', {
                body: {
                    ...formData,
                    planType: 'yearly',
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
            console.error('Erro ao criar checkout:', error);
            toast({
                title: "Erro ao processar",
                description: error.message || "Não foi possível criar a sessão de pagamento.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const plans = [
        {
            id: 'annual' as PlanType,
            name: t('businessRegister.annualPlan'),
            price: 958.80,
            priceLabel: 'R$ 958,80',
            installmentLabel: '(12x R$ 79,90)',
            discount: t('businessRegister.discount'),
            icon: Sparkles,
            popular: true,
            features: [
                t('businessRegister.allBenefitsMonthly'),
                t('businessRegister.annualSaving'),
                t('businessRegister.premiumPosition'),
                t('businessRegister.searchHighlight'),
                t('businessRegister.annualPartnerBadge'),
                t('businessRegister.vipSupport')
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src={supplierService}
                    alt="Empresas do ramo de pesca"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                {t('businessRegister.title')}
                            </h1>
                            <p className="text-xl text-white/90">
                                {t('businessRegister.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">{t('businessRegister.expandBusiness')}</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            {t('businessRegister.expandBusinessDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('businessRegister.nationalReach')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('businessRegister.nationalReachDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('businessRegister.increaseSales')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('businessRegister.increaseSalesDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('businessRegister.featuredLocation')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('businessRegister.featuredLocationDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('businessRegister.credibility')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('businessRegister.credibilityDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Plans and Registration */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t('businessRegister.choosePlan')}</h2>
                        <p className="text-lg text-muted-foreground">
                            {t('businessRegister.choosePlanDesc')}
                        </p>
                    </div>

                    <div className="max-w-md mx-auto mb-12">
                        {plans.map((plan) => {
                            const Icon = plan.icon;
                            // Safe cast or check for property existence if needed, but since we defined it above it works.
                            // However, TS might complain if the type inferred doesn't match usage.
                            // Let's modify the usage to check for property.
                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative border-2 border-primary shadow-lg scale-105`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                                            {t('businessRegister.mostAdvantage')}
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <Icon className={`h-12 w-12 mx-auto mb-4 text-yellow-500`} />
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                        {plan.discount && (
                                            <div className="text-sm text-primary font-semibold">{plan.discount}</div>
                                        )}
                                        <div className="mt-4 text-primary">
                                            <div className="text-4xl font-bold">
                                                {plan.priceLabel}
                                            </div>
                                            {'installmentLabel' in plan && (
                                                <div className="text-lg font-medium mt-1">
                                                    {(plan as any).installmentLabel}
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 mb-6">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <Check className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            variant="default"
                                            className="w-full"
                                            disabled={true}
                                        >
                                            {t('businessRegister.planSelected')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Registration Form */}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>{t('businessRegister.registrationData')}</CardTitle>
                            <CardDescription>
                                {t('businessRegister.completeDataSubscribe')} {plans[0].name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="bg-muted p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">{t('businessRegister.planSelected')}:</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {plans[0].name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Valor Anual</p>
                                            <p className="text-3xl font-bold text-primary">
                                                R$ {plans[0].price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('common.name')} *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('common.email')} *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('common.phone')} *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">{t('businessRegister.companyName')} *</Label>
                                        <Input
                                            id="company"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Nome da empresa"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessType">{t('businessRegister.businessType')} *</Label>
                                        <Input
                                            id="businessType"
                                            required
                                            value={formData.businessType}
                                            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            placeholder="Ex: Hotel, Pousada, Loja de Pesca"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">{t('businessRegister.location')} *</Label>
                                        <Input
                                            id="location"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Cidade/Estado"
                                        />
                                    </div>
                                </div>

                                {/* Redes Sociais */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold mb-4">Redes Sociais (opcional)</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
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
                                </div>

                                <TermsOfUseAcceptance
                                    checked={termsAccepted}
                                    onCheckedChange={setTermsAccepted}
                                    required
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading || !termsAccepted}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('common.processing')}
                                        </>
                                    ) : (
                                        `Assinar Plano Anual - R$ 958,80/Ano`
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
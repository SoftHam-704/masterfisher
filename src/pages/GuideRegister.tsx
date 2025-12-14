import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { TermsOfUseAcceptance } from "@/components/TermsOfUseAcceptance";
import PhotoUpload from "@/components/PhotoUpload";
import { Check, Loader2, Fish, Shield, Award, TrendingUp, Users, Calendar } from "lucide-react";
import heroFishing from "@/assets/hero-fishing.jpg";

export default function GuideRegister() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        specialties: '',
        instagram_url: '',
        facebook_url: '',
        youtube_url: '',
        website_url: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

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
         const { data, error } = await supabase.functions.invoke('create-mercadopago-checkout', {
                body: {
                    ...formData,
                    planType: 'guide',
                    amount: 50, // R$ 50,00 (Mercado Pago usa reais, não centavos)
                    origin: window.location.origin,
                    photoUrl: photoUrl
                }
            });
            if (error) throw error;

            // Use sandbox URL for local testing, production URL otherwise
            const checkoutUrl = window.location.hostname === 'localhost' ? (data.sandboxUrl || data.url) : data.url;
            if (checkoutUrl) {
                window.open(checkoutUrl, '_blank');
                toast({
                    title: t('common.redirecting'),
                    description: t('common.checkoutOpened')
                });
            } else {
                throw new Error('URL de checkout não retornada');
            }
        } catch (error: any) {
            console.error('Erro ao criar checkout:', error);
            toast({
                title: t('common.errorProcessing'),
                description: error.message || t('common.couldNotCreateSession'),
                variant: "destructive"
            });
            // Update user profile to mark as guide
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('profiles')
                    .update({ user_type: 'guide' })
                    .eq('user_id', user.id);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        t('guideRegister.professionalPlanFeature1'),
        t('guideRegister.professionalPlanFeature2'),
        t('guideRegister.professionalPlanFeature3'),
        t('guideRegister.professionalPlanFeature4'),
        t('guideRegister.professionalPlanFeature5'),
        t('guideRegister.professionalPlanFeature6'),
        t('guideRegister.professionalPlanFeature7'),
        t('guideRegister.professionalPlanFeature8')
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <img
                    src={heroFishing}
                    alt="Guia de pesca profissional"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                {t('guideRegister.title')}
                            </h1>
                            <p className="text-xl text-white/90">
                                {t('guideRegister.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-muted/50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">{t('guideRegister.whyRegister')}</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            {t('guideRegister.whyRegisterDesc')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('guideRegister.moreClients')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('guideRegister.moreClientsDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('guideRegister.simplifiedManagement')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('guideRegister.simplifiedManagementDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('guideRegister.increaseIncome')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('guideRegister.increaseIncomeDesc')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{t('guideRegister.credibility')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('guideRegister.credibilityDesc')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Plan and Registration */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Plan Card */}
                        <Card className="border-2 border-primary shadow-lg">
                            <CardHeader className="text-center bg-primary/5">
                                <Fish className="h-16 w-16 mx-auto mb-4 text-primary" />
                                <CardTitle className="text-3xl">{t('guideRegister.professionalPlan')}</CardTitle>
                                <div className="text-5xl font-bold mt-4 text-primary">
                                    R$ 50,00
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{t('guideRegister.oneTimePayment')}</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ul className="space-y-3">
                                    {benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <Check className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                                            <span className="text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                                    <p className="text-sm font-semibold text-center text-primary">
                                        {t('guideRegister.completeAccessPlatform')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Registration Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('guideRegister.registrationInfo')}</CardTitle>
                                <CardDescription>
                                    {t('guideRegister.completeData')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('guideRegister.fullName')} *</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
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
                                        <Label htmlFor="phone">Telefone *</Label>
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
                                        <Label htmlFor="experience">{t('guideRegister.yearsExperience')} *</Label>
                                        <Input
                                            id="experience"
                                            required
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            placeholder="Ex: 10 anos"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="specialties">{t('guideRegister.specialties')} *</Label>
                                        <Input
                                            id="specialties"
                                            required
                                            value={formData.specialties}
                                            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                                            placeholder="Ex: Pesca de tucunaré, traíra, dourado"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <PhotoUpload
                                            onUploadComplete={(url) => setPhotoUrl(url)}
                                            currentPhotoUrl={photoUrl}
                                            label="Sua Foto Profissional *"
                                            description="Envie uma foto sua que sera exibida na pagina inicial do MasterFisher"
                                        />
                                    </div>

                                    {/* Redes Sociais */}
                                    <div className="border-t pt-4 mt-4">
                                        <Label className="text-base font-semibold">Redes Sociais (opcional)</Label>
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="instagram_url" className="text-sm">Instagram</Label>
                                                <Input
                                                    id="instagram_url"
                                                    type="url"
                                                    value={formData.instagram_url}
                                                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="facebook_url" className="text-sm">Facebook</Label>
                                                <Input
                                                    id="facebook_url"
                                                    type="url"
                                                    value={formData.facebook_url}
                                                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="youtube_url" className="text-sm">YouTube</Label>
                                                <Input
                                                    id="youtube_url"
                                                    type="url"
                                                    value={formData.youtube_url}
                                                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="website_url" className="text-sm">Website</Label>
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
                                                Processando...
                                            </>
                                        ) : (
                                            t('guideRegister.payAndFinalize')
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
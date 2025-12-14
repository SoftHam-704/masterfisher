import { Anchor, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const CTASection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    

    return (
        <section className="py-24 bg-ocean-gradient relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-turquoise/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-golden/10 rounded-full blur-3xl animate-float animation-delay-500" />

            {/* Wave pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="currentColor" className="text-primary-foreground" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
                        <Anchor className="w-4 h-4 text-turquoise" />
                        <span className="text-primary-foreground/90 text-sm font-body">
                            {t("cta.badge")}
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                        {t("cta.titleLine1")}
                        <br />
                        <span className="text-gradient-golden">{t("cta.titleLine2")}</span>
                    </h2>

                    <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12">
                        {t("cta.subtitle")}
                    </p>

                    {/* CTA Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer">
                            <div className="w-16 h-16 rounded-xl bg-turquoise/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-turquoise" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                                {t("cta.beGuide")}
                            </h3>
                            <p className="font-body text-primary-foreground/60 text-sm mb-4">
                                {t("cta.beGuideDesc")}
                            </p>
                            <Button
                                onClick={() => navigate("/cadastrar-guia")}
                                className="w-full bg-turquoise hover:bg-turquoise/90 text-white"
                            >
                                {t("cta.registerNow")}
                            </Button>
                        </div>

                        <div className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer border-2 border-golden/30">
                            <div className="w-16 h-16 rounded-xl bg-golden/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-8 h-8 text-golden" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                                {t("cta.beSupplier")}
                            </h3>
                            <p className="font-body text-primary-foreground/60 text-sm mb-4">
                                {t("cta.beSupplierDesc")}
                            </p>
                            <Button
                                onClick={() => navigate("/cadastrar-empresa")}
                                className="w-full bg-golden hover:bg-golden/90 text-white shadow-golden"
                            >
                                {t("cta.registerNow")}
                            </Button>
                        </div>

                        <div className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer">
                            <div className="w-16 h-16 rounded-xl bg-turquoise/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Anchor className="w-8 h-8 text-turquoise" />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                                {t("cta.bePartner")}
                            </h3>
                            <p className="font-body text-primary-foreground/60 text-sm mb-4">
                                {t("cta.bePartnerDesc")}
                            </p>
                            <Button
                                onClick={() => navigate("/parceiro-checkout")}
                                className="w-full bg-turquoise hover:bg-turquoise/90 text-white"
                            >
                                {t("cta.beSponsor")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;


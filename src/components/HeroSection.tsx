import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Users, MapPin, Building2 } from "lucide-react";
import heroImage from "@/assets/hero-fishing.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFloatingCTA } from "@/contexts/FloatingCTAContext";

const HeroSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { openModal } = useFloatingCTA();
    const [stats, setStats] = useState({
        guides: 0,
        businesses: 0,
        tourists: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Count guides
                const { count: guidesCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_type', 'guide');

                // Count businesses
                const { count: businessesCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_type', 'business');

                // Count tourists
                const { count: touristsCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_type', 'tourist');

                setStats({
                    guides: guidesCount || 0,
                    businesses: businessesCount || 0,
                    tourists: touristsCount || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const statsCards = [
        {
            icon: Users,
            label: t("common.guides"),
            value: stats.guides > 0 ? `${stats.guides}+` : "0",
            onClick: () => navigate("/encontrar-servicos")
        },
        {
            icon: Building2,
            label: t("common.companies"),
            value: stats.businesses > 0 ? `${stats.businesses}+` : "0",
            onClick: () => navigate("/encontrar-servicos")
        },
        {
            icon: Users,
            label: t("common.tourists"),
            value: stats.tourists > 0 ? `${stats.tourists}+` : "0",
            onClick: openModal
        },
    ];

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Pescaria"
                    className="w-full h-full object-cover"
                />
                {/* Reduced overlay opacity to make image more prominent */}
                <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/70 via-ocean-dark/60 to-ocean-dark/80" />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 pt-20 pb-16">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 md:mb-8 animate-fade-in-up">
                        <Compass className="w-4 h-4 text-turquoise" />
                        <span className="text-primary-foreground/90 text-sm font-body">
                            A maior plataforma de pesca do Brasil
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 md:mb-6 animate-fade-in-up animation-delay-200">
                        {t("hero.titleLine1")}
                        <br />
                        <span className="text-gradient-golden">{t("hero.titleLine2")}</span>
                        <br />
                        {t("hero.titleLine3")}
                    </h1>

                    {/* Subtitle */}
                    <p className="font-body text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-in-up animation-delay-400">
                        {t("hero.subtitle")}
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto animate-fade-in-up animation-delay-800">
                        {statsCards.map((stat, index) => (
                            <div
                                key={index}
                                onClick={stat.onClick}
                                className={`glass-card rounded-2xl p-4 md:p-6 hover-lift ${stat.onClick ? 'cursor-pointer' : ''}`}
                            >
                                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-turquoise mx-auto mb-2 md:mb-3" />
                                <div className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm text-primary-foreground/70">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
                <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

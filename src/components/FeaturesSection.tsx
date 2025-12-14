import { Compass, Users, ShoppingBag, Camera, MapPin, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const FeaturesSection = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { toast } = useToast();

    const features = [
        {
            icon: Compass,
            title: t("features.findGuides.title"),
            description: t("features.findGuides.desc"),
            color: "from-turquoise to-ocean-light",
            link: "/encontrar-servicos"
        },
        {
            icon: ShoppingBag,
            title: t("features.suppliers.title"),
            description: t("features.suppliers.desc"),
            color: "from-golden to-sunset",
            link: "/encontrar-servicos"
        },
        {
            icon: MapPin,
            title: t("features.destinations.title"),
            description: t("features.destinations.desc"),
            color: "from-nature to-turquoise",
            link: "/destinos"
        },
        {
            icon: Camera,
            title: t("features.community.title"),
            description: t("features.community.desc"),
            color: "from-ocean-light to-primary",
            comingSoon: true,
        },
        {
            icon: Users,
            title: t("features.groups.title"),
            description: t("features.groups.desc"),
            color: "from-sunset to-golden",
            comingSoon: true,
        },
        {
            icon: Award,
            title: t("features.ranking.title"),
            description: t("features.ranking.desc"),
            color: "from-turquoise-glow to-turquoise",
            link: "/ranking",
        },
    ];

    return (
        <section id="features" className="py-24 bg-gradient-to-b from-ocean-dark to-ocean-deep relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-turquoise/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-golden/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-turquoise/10 text-turquoise font-body text-sm mb-4">
                        {t("features.badge")}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                        {t("features.titleLine1")}
                        <span className="text-gradient-golden"> {t("features.titleLine2")}</span>
                    </h2>
                    <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
                        {t("features.subtitle")}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            onClick={() => feature.comingSoon ? toast({ title: "Em Breve! 🚀", description: "Esta funcionalidade está sendo desenvolvida." }) : feature.link && navigate(feature.link)}
                            className="group glass-card-dark rounded-2xl p-6 hover-lift cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-primary-foreground" />
                            </div>

                            {/* Content */}
                            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2 group-hover:text-turquoise transition-colors">
                                {feature.title}
                            </h3>
                            <p className="font-body text-primary-foreground/60">
                                {feature.description}
                            </p>

                            {/* Hover indicator */}
                            {feature.link && (
                                <div className="mt-4 flex items-center gap-2 text-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm font-body">{t("features.explore")}</span>
                                    <span className="text-lg">→</span>
                                </div>
                            )}
                            {feature.comingSoon && (
                                <div className="mt-4 flex items-center gap-2 text-golden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-sm font-body">Em Breve</span>
                                    <span className="text-lg">🚀</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
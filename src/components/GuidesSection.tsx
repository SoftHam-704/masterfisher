import { Star, MapPin, Fish, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import guideImage from "@/assets/guide-1.jpg";
import pantanalImage from "@/assets/pantanal.jpg";

const guides = [
    {
        id: 1,
        name: "Carlos Silva",
        specialty: "Pesca de Tucunaré",
        location: "Amazônia, AM",
        rating: 4.9,
        reviews: 127,
        image: guideImage,
        price: "R$ 450/dia",
    },
    {
        id: 2,
        name: "Roberto Mendes",
        specialty: "Pesca de Dourado",
        location: "Pantanal, MS",
        rating: 4.8,
        reviews: 98,
        image: guideImage,
        price: "R$ 380/dia",
    },
    {
        id: 3,
        name: "João Ferreira",
        specialty: "Pesca Oceânica",
        location: "Florianópolis, SC",
        rating: 5.0,
        reviews: 156,
        image: guideImage,
        price: "R$ 600/dia",
    },
];

const GuidesSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    

    return (
        <section id="guides" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={pantanalImage}
                    alt="Vista aérea do Pantanal"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-ocean-dark/95 to-ocean-deep" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <span className="inline-block px-4 py-2 rounded-full bg-golden/10 text-golden font-body text-sm mb-4">
                            {t("guides.badge")}
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
                            {t("guides.titleLine1")}
                            <span className="text-gradient-golden"> {t("guides.titleLine2")}</span>
                        </h2>
                    </div>
                    <Button
                        onClick={() => navigate("/encontrar-servicos")}
                        size="lg"
                        className="mt-6 md:mt-0 glass-card border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-transparent"
                    >
                        {t("guides.viewAll")}
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>

                {/* Guides Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {guides.map((guide, index) => (
                        <div
                            key={guide.id}
                            className="group relative bg-card rounded-2xl overflow-hidden shadow-ocean hover-lift"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={guide.image}
                                    alt={guide.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                                {/* Price Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-golden text-foreground font-display font-semibold text-sm">
                                    {guide.price}
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card">
                                    <Star className="w-4 h-4 text-golden fill-golden" />
                                    <span className="text-primary-foreground font-semibold text-sm">{guide.rating}</span>
                                    <span className="text-primary-foreground/60 text-xs">({guide.reviews})</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-display text-xl font-bold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                                    {guide.name}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                    <Fish className="w-4 h-4 text-turquoise" />
                                    <span className="font-body text-sm">{guide.specialty}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4 text-golden" />
                                    <span className="font-body text-sm">{guide.location}</span>
                                </div>

                                {/* CTA */}
                                <Button
                                    onClick={() => navigate("/encontrar-servicos")}
                                    variant="default"
                                    className="w-full mt-6 bg-turquoise hover:bg-turquoise/90"
                                >
                                    {t("guides.viewProfile")}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GuidesSection;


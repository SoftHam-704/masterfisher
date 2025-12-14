import { useState, useEffect } from "react";
import { Camera, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import fishCatch from "@/assets/featured-fisher.png";
import guideImage from "@/assets/guide-1.jpg";
import manuBoatImage from "@/assets/manu-boat.png";
import heroImage from "@/assets/hero-fishing.jpg";

const galleryImages = [
    {
        id: 1,
        image: fishCatch,
        title: "Tucunaré Açu",
        author: "Beth R.",
        location: "Rio Negro, AM",
        likes: 234,
        comments: 18,
        size: "large",
    },
    {
        id: 2,
        image: guideImage,
        title: "Dourado Troféu",
        author: "Roberto S.",
        location: "Pantanal, MS",
        likes: 187,
        comments: 24,
        size: "small",
    },
    {
        id: 3,
        image: manuBoatImage,
        title: "Pescaria no Amanhecer",
        author: "Manu M.",
        location: "Rio Araguaia, GO",
        likes: 312,
        comments: 42,
        size: "small",
    },
    {
        id: 4,
        image: heroImage,
        title: "A Fisgada Perfeita",
        author: "André L.",
        location: "Barcelos, AM",
        likes: 456,
        comments: 67,
        size: "medium",
    },
];

const GallerySection = () => {
    const { t } = useLanguage();
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
        };
        checkAuth();
    }, []);

    const handleShareClick = () => {
        if (isAuthenticated) {
            navigate("/perfil");
        } else {
            toast({
                title: t("gallery.loginRequired"),
                description: t("gallery.loginToShare"),
                variant: "destructive",
            });
            navigate("/auth");
        }
    };

    return (
        <section id="gallery" className="py-24 bg-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-turquoise/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-golden/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-body text-sm mb-4">
                        {t("gallery.badge")}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                        {t("gallery.titleLine1")}
                        <span className="text-gradient-ocean"> {t("gallery.titleLine2")}</span>
                    </h2>
                    <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("gallery.subtitle")}
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {galleryImages.map((item, index) => (
                        <div
                            key={item.id}
                            className={`relative rounded-2xl overflow-hidden cursor-pointer group ${item.size === "large" ? "col-span-2 row-span-2" :
                                item.size === "medium" ? "col-span-2" : ""
                                }`}
                            onMouseEnter={() => setHoveredId(item.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`${item.size === "large" ? "h-[500px]" : item.size === "medium" ? "h-64" : "h-60"}`}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent transition-opacity duration-300 ${hoveredId === item.id ? "opacity-100" : "opacity-0"
                                }`}>
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                    <h3 className="font-display text-lg md:text-xl font-bold text-background mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="font-body text-sm text-background/70 mb-4">
                                        {item.author} • {item.location}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-background/80 hover:text-golden transition-colors">
                                            <Heart className="w-5 h-5" />
                                            <span className="text-sm">{item.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-background/80 hover:text-turquoise transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="text-sm">{item.comments}</span>
                                        </button>
                                        <button className="text-background/80 hover:text-background transition-colors ml-auto">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Button
                        onClick={handleShareClick}
                        size="lg"
                        className="bg-golden hover:bg-golden/90 text-white shadow-golden"
                    >
                        <Camera className="w-5 h-5" />
                        {t("gallery.shareButton")}
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;


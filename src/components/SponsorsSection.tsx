import { Star, ArrowRight, Instagram, Facebook, Youtube, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Gradientes disponíveis para os cards
const gradients = [
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
];

// Dados de fallback caso não haja parceiros Master no banco
const fallbackSponsors = [
    { name: "FishPro", tagline: "Equipamentos Premium", gradient: "from-cyan-500 to-blue-600" },
    { name: "MarineGear", tagline: "Tecnologia Náutica", gradient: "from-emerald-500 to-teal-600" },
    { name: "OceanMaster", tagline: "Vista-se para Pescar", gradient: "from-amber-500 to-orange-600" },
];

const fallbackSecondarySponsors = [
    { name: "CastKing", category: "Iscas Artificiais", logoUrl: null as string | null },
    { name: "ReelTech", category: "Carretilhas", logoUrl: null as string | null },
    { name: "AquaLine", category: "Linhas Premium", logoUrl: null as string | null },
    { name: "TideForce", category: "Embarcações", logoUrl: null as string | null },
    { name: "NetWorks", category: "Acessórios", logoUrl: null as string | null },
    { name: "RiverPro", category: "Eletrônicos", logoUrl: null as string | null },
];

const partners = [
    "Shimano", "Rapala", "Abu Garcia", "Daiwa", "Penn",
    "Okuma", "Berkley", "Strike King", "Lews", "13 Fishing",
];

interface MasterPartner {
    id: string;
    company: string | null;
    name: string;
    area: string | null;
    logo_url: string | null;
    website_url: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    youtube_url: string | null;
}

interface MappedSponsor {
    name: string;
    tagline?: string;
    category?: string;
    gradient?: string;
    logoUrl: string | null;
    websiteUrl?: string | null;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    youtubeUrl?: string | null;
}

const SponsorsSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [masterPartners, setMasterPartners] = useState<MasterPartner[]>([]);
    const [goldPartners, setGoldPartners] = useState<MasterPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Buscar parceiros do banco
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                // Fetch Master Partners
                const { data: masterData, error: masterError } = await supabase
                    .from('partner_payments')
                    .select('id, company, name, area, logo_url, website_url, instagram_url, facebook_url, youtube_url')
                    .eq('plan_type', 'master')
                    .in('payment_status', ['succeeded', 'active', 'paid'])
                    .limit(3);

                if (masterError) throw masterError;
                setMasterPartners(masterData || []);

                // Fetch Gold Partners
                const { data: goldData, error: goldError } = await supabase
                    .from('partner_payments')
                    .select('id, company, name, area, logo_url, website_url, instagram_url, facebook_url, youtube_url')
                    .eq('plan_type', 'gold')
                    .in('payment_status', ['succeeded', 'active', 'paid'])
                    .limit(6);

                if (goldError) throw goldError;
                setGoldPartners(goldData || []);

            } catch (error) {
                console.error('Erro ao buscar parceiros:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPartners();
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let scrollPosition = 0;

        const scroll = () => {
            if (!isPaused && scrollContainer) {
                scrollPosition += 1;
                if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                    scrollPosition = 0;
                }
                scrollContainer.scrollLeft = scrollPosition;
            }
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationId);
    }, [isPaused]);

    // Usar dados do banco se disponíveis, caso contrário usar fallback
    const featuredSponsors: MappedSponsor[] = masterPartners.length > 0
        ? masterPartners.map((partner, index) => ({
            name: partner.company || partner.name,
            tagline: partner.area || 'Parceiro Master',
            gradient: gradients[index % gradients.length],
            logoUrl: partner.logo_url,
            websiteUrl: partner.website_url,
            instagramUrl: partner.instagram_url,
            facebookUrl: partner.facebook_url,
            youtubeUrl: partner.youtube_url,
        }))
        : fallbackSponsors.map(s => ({ ...s, logoUrl: null }));

    const secondarySponsors: MappedSponsor[] = goldPartners.length > 0
        ? goldPartners.map(partner => ({
            name: partner.company || partner.name,
            category: partner.area || 'Parceiro Gold',
            logoUrl: partner.logo_url
        }))
        : fallbackSecondarySponsors;

    return (
        <section id="sponsors" className="relative py-20 overflow-hidden">
            {/* Dynamic gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />

            {/* Animated mesh gradient overlay */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }} />

            <div className="container relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                            {t("sponsors.badge")}
                        </span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white">
                        {t("sponsors.titleLine1")}{" "}
                        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                            {t("sponsors.titleLine2")}
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                        {t("sponsors.subtitle")}
                    </p>
                </div>

                {/* Featured Sponsors - Cards de tamanho igual */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {featuredSponsors.map((sponsor) => (
                        <div
                            key={sponsor.name}
                            className="group relative overflow-hidden rounded-3xl"
                            style={{ minHeight: '280px' }}
                        >
                            {/* Gradient background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.gradient} opacity-90`} />

                            {/* Animated pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                                    backgroundSize: '30px 30px'
                                }} />
                            </div>

                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                            </div>

                            {/* Content */}
                            <div className="relative h-full p-6 flex flex-col justify-between">
                                <div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                        {'logoUrl' in sponsor && sponsor.logoUrl ? (
                                            <img
                                                src={sponsor.logoUrl}
                                                alt={sponsor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl font-display font-bold text-white">
                                                {sponsor.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1">
                                        {sponsor.name}
                                    </h3>
                                    <p className="text-white/80 text-sm">{sponsor.tagline}</p>
                                </div>

                                {/* Social Links */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {'instagramUrl' in sponsor && sponsor.instagramUrl && (
                                            <a
                                                href={sponsor.instagramUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                                title="Instagram"
                                            >
                                                <Instagram className="w-4 h-4 text-white" />
                                            </a>
                                        )}
                                        {'facebookUrl' in sponsor && sponsor.facebookUrl && (
                                            <a
                                                href={sponsor.facebookUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                                title="Facebook"
                                            >
                                                <Facebook className="w-4 h-4 text-white" />
                                            </a>
                                        )}
                                        {'youtubeUrl' in sponsor && sponsor.youtubeUrl && (
                                            <a
                                                href={sponsor.youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                                title="YouTube"
                                            >
                                                <Youtube className="w-4 h-4 text-white" />
                                            </a>
                                        )}
                                        {'websiteUrl' in sponsor && sponsor.websiteUrl && (
                                            <a
                                                href={sponsor.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                                title="Website"
                                            >
                                                <Globe className="w-4 h-4 text-white" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Glow on hover */}
                            <div className="absolute inset-0 rounded-3xl ring-2 ring-white/0 group-hover:ring-white/30 transition-all duration-500" />
                        </div>
                    ))}
                </div>

                {/* Secondary Sponsors Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
                    {secondarySponsors.map((sponsor) => (
                        <div
                            key={sponsor.name}
                            className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Logo placeholder or real logo */}
                            <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                {sponsor.logoUrl ? (
                                    <img
                                        src={sponsor.logoUrl}
                                        alt={sponsor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl font-display font-bold text-white">
                                        {sponsor.name.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div className="text-center">
                                <span className="font-semibold text-white block text-sm">
                                    {sponsor.name}
                                </span>
                                <span className="text-xs text-white/50">
                                    {sponsor.category}
                                </span>
                            </div>

                            {/* Hover glow */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(255,255,255,0.1)]" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partners Infinite Marquee */}
                <div className="relative mb-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-display font-semibold text-white mb-2">
                            {t("sponsors.partnerBrands")}
                        </h3>
                        <p className="text-white/60">
                            {t("sponsors.partnerBrandsDesc")}
                        </p>
                    </div>

                    {/* Gradient masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

                    {/* Scrolling container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-hidden py-4"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Double the items for seamless loop */}
                        {[...partners, ...partners].map((partner, index) => (
                            <div
                                key={`${partner}-${index}`}
                                className="flex-shrink-0 px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer"
                            >
                                <span className="font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap">
                                    {partner}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30 p-8 md:p-12">
                    {/* Animated background */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "0.5s" }} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                                {t("sponsors.becomePartnerTitle")}
                            </h4>
                            <p className="text-white/70 text-lg">
                                {t("sponsors.becomePartnerDesc")}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/parceiro-checkout")}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {t("sponsors.becomePartnerBtn")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SponsorsSection;
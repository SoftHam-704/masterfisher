import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Menu, X, Globe, ShieldCheck, Bell, MessageSquare } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NotificationsPanel from "@/components/NotificationsPanel";
import MessagesPanel from "@/components/MessagesPanel";
import { useFloatingCTA } from "@/contexts/FloatingCTAContext";
import { AdminAuthModal } from "@/components/admin/AdminAuthModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
    display_name: string | null;
    avatar_url: string | null;
}

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, setLanguage, t } = useLanguage();
    const { openModal } = useFloatingCTA();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminModalOpen, setAdminModalOpen] = useState(false);

    useEffect(() => {
        fetchUserAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
                setIsAdmin(session.user.email === 'softham2008@gmail.com');
            } else {
                setUserProfile(null);
                setIsAdmin(false);
            }
        });

        // Listen for profile updates
        const handleProfileUpdate = () => {
            fetchUserAndProfile();
        };
        window.addEventListener('profile-updated', handleProfileUpdate);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('profile-updated', handleProfileUpdate);
        };
    }, []);

    const fetchUserAndProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        if (user) {
            await fetchUserProfile(user.id);
            setIsAdmin(user.email === 'softham2008@gmail.com');
        }
    };

    const fetchUserProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', userId)
            .single();

        if (data) {
            setUserProfile(data);
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();

            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            setMobileMenuOpen(false);
        }
    };

    const navLinks = [
        { label: t("common.home"), href: "#hero" },
        { label: t("common.guides"), href: "#guides" },
        { label: t("common.destinations"), href: "/destinos" },
        { label: "Blog", href: "/blog" },
        { label: t("common.gallery"), href: "#gallery" },
        { label: t("common.partners"), href: "#sponsors" },
        { label: t("common.about"), href: "/sobre" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card-dark border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        link.href.startsWith('#') ? (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-body text-sm cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-body text-sm"
                            >
                                {link.label}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Right Side - Login/Profile */}
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" title="Alterar Idioma">
                                <Globe className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card-dark border-white/10">
                            <DropdownMenuItem onClick={() => setLanguage("pt-BR")} className="cursor-pointer hover:bg-white/10 text-foreground">
                                🇧🇷 Português
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage("en-US")} className="cursor-pointer hover:bg-white/10 text-foreground">
                                🇺🇸 English
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage("es-ES")} className="cursor-pointer hover:bg-white/10 text-foreground">
                                🇪🇸 Español
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAdminModalOpen(true)}
                        className="text-primary-foreground hover:bg-white/10"
                        title="Painel Admin"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </Button>

                    <AdminAuthModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />

                    {/* Notifications */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                                <Bell className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" align="end">
                            <NotificationsPanel />
                        </PopoverContent>
                    </Popover>

                    {/* Messages */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                                <MessageSquare className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-0" align="end">
                            <MessagesPanel />
                        </PopoverContent>
                    </Popover>

                    {currentUser ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/perfil")}
                            className="relative"
                        >
                            {userProfile?.avatar_url ? (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.display_name || "User"} />
                                    <AvatarFallback>
                                        {userProfile.display_name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                    </AvatarFallback>
                                </Avatar>
                            ) : (
                                <User className="w-5 h-5 text-primary-foreground" />
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={openModal}
                            className="bg-transparent border-0 text-primary-foreground hover:text-primary-foreground/80 font-body"
                            variant="ghost"
                        >
                            Login
                        </Button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-primary-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden glass-card-dark border-t border-white/10">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            link.href.startsWith('#') ? (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-body text-sm py-2 cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors font-body text-sm py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
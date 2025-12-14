import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();


    return (
        <footer className="bg-ocean-deep text-primary-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* About */}
                    <div>
                        <h3 className="font-display text-xl font-bold mb-4 text-gradient-golden">
                            MasterFisher
                        </h3>
                        <p className="font-body text-sm text-primary-foreground/70 mb-4">
                            {t("footer.description")}
                        </p>
                        <div className="flex gap-3">
                            <a href="https://www.facebook.com/profile.php?id=61584668503215" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-turquoise transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/masterfisherbrasil/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-turquoise transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
                        <ul className="space-y-2 font-body text-sm">
                            <li>
                                <button onClick={() => navigate("/encontrar-servicos")} className="text-primary-foreground/70 hover:text-turquoise transition-colors">
                                    {t("footer.findGuides")}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/cadastrar-guia")} className="text-primary-foreground/70 hover:text-turquoise transition-colors">
                                    {t("footer.beGuide")}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/parceiros")} className="text-primary-foreground/70 hover:text-turquoise transition-colors">
                                    {t("footer.partners")}
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate("/sobre")} className="text-primary-foreground/70 hover:text-turquoise transition-colors">
                                    {t("footer.about")}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display text-lg font-semibold mb-4">{t("footer.contact")}</h4>
                        <ul className="space-y-3 font-body text-sm">
                            <li className="flex items-center gap-2 text-primary-foreground/70">
                                <Mail className="w-4 h-4 text-turquoise" />
                                contato@masterfisher.com.br
                            </li>
                            <li className="flex items-center gap-2 text-primary-foreground/70">
                                <Phone className="w-4 h-4 text-turquoise" />
                                (67) 99607-8885
                            </li>
                            <li className="flex items-center gap-2 text-primary-foreground/70">
                                <MapPin className="w-4 h-4 text-turquoise" />
                                Brasil
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="font-body text-sm text-primary-foreground/60">
                            © 2024 MasterFisher. {t("footer.rights")}
                        </p>
                        <div className="flex gap-6 font-body text-sm">
                            <button onClick={() => navigate("/termos")} className="text-primary-foreground/60 hover:text-turquoise transition-colors">
                                {t("footer.terms")}
                            </button>
                            <button onClick={() => navigate("/privacidade")} className="text-primary-foreground/60 hover:text-turquoise transition-colors">
                                {t("footer.privacy")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
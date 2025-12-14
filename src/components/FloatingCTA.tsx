import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const FloatingCTA = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUp = () => {
    navigate("/cadastrar");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      {/* Expanded Card */}
      <div
        className={`absolute bottom-16 right-0 w-72 bg-ocean-dark/95 backdrop-blur-xl rounded-2xl border border-turquoise/30 shadow-2xl transition-all duration-300 overflow-hidden ${
          isExpanded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-turquoise/10 via-transparent to-golden/10" />
        <div className="relative p-5">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="mb-4">
            <h4 className="font-display text-lg font-bold text-primary-foreground mb-2">
              {t("floatingCta.title")}
            </h4>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {t("floatingCta.subtitle")}
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-turquoise to-turquoise-light hover:from-turquoise-light hover:to-turquoise text-ocean-dark font-semibold"
              size="sm"
            >
              {t("floatingCta.createAccount")}
            </Button>
            <p className="text-xs text-center text-primary-foreground/50">
              {t("floatingCta.hasAccount")} <button onClick={handleSignIn} className="text-turquoise hover:underline">{t("floatingCta.login")}</button>
            </p>
          </div>
        </div>
      </div>

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative flex items-center gap-3 bg-gradient-to-r from-golden via-golden-light to-golden text-ocean-dark font-display font-bold px-5 py-3 rounded-full shadow-lg hover:shadow-golden/40 transition-all duration-300 hover:scale-105"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-golden/50 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-golden animate-ping opacity-20" />
        
        <div className="relative flex items-center gap-2">
          <UserPlus size={20} className="transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">{t("floatingCta.mainButton")}</span>
        </div>
      </button>
    </div>
  );
};

export default FloatingCTA;


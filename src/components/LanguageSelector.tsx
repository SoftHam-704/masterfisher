import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background z-50">
        <DropdownMenuRadioGroup 
          value={language} 
          onValueChange={(value) => setLanguage(value as 'pt-BR' | 'en-US' | 'es-ES')}
        >
          <DropdownMenuRadioItem value="pt-BR">
            🇧🇷 Português (Brasil)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en-US">
            🇺🇸 English (USA)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es-ES">
            🇪🇸 Español (España)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;

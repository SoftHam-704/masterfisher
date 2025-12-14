import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <img 
      src={logoImage} 
      alt="MasterFisher Logo" 
      className={cn("h-16 w-auto", className)}
    />
  );
};

export default Logo;

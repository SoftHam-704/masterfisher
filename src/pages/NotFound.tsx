import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center px-4">
        <Logo className="text-4xl mb-8 inline-block" />
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Página não encontrada</p>
        <Link to="/">
          <Button variant="ocean" size="lg">
            Voltar para o Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

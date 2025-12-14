import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminGuides } from "@/components/admin/AdminGuides";
import { AdminPartners } from "@/components/admin/AdminPartners";
import { AdminSuppliers } from "@/components/admin/AdminSuppliers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type AdminView = "dashboard" | "users" | "guides" | "partners" | "suppliers";

const ADMIN_EMAIL = 'softham2008@gmail.com';

const Admin = () => {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        navigate("/");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <AdminUsers />;
      case "guides":
        return <AdminGuides />;
      case "partners":
        return <AdminPartners />;
      case "suppliers":
        return <AdminSuppliers />;
      default:
        return <AdminDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-pulse text-white">Verificando permissões...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;

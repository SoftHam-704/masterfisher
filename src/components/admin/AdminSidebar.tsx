import {
  LayoutDashboard,
  Users,
  Fish,
  Building2,
  Handshake,
  LogOut,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminView } from "@/pages/Admin";

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export const AdminSidebar = ({ currentView, onViewChange }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      view: "dashboard" as AdminView,
    },
    {
      title: "Turistas",
      icon: Users,
      view: "users" as AdminView,
    },
    {
      title: "Guias",
      icon: Fish,
      view: "guides" as AdminView,
    },
    {
      title: "Parceiros",
      icon: Handshake,
      view: "partners" as AdminView,
    },
    {
      title: "Fornecedores",
      icon: Building2,
      view: "suppliers" as AdminView,
    },
  ];

  return (
    <Sidebar className="bg-white border-r border-gray-100">
      <SidebarContent className="bg-white pt-6">
        <div className="px-6 mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            MasterFisher
          </h1>
          <p className="text-xs text-slate-400">Painel Admin</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 gap-1">
              {menuItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.view)}
                      isActive={isActive}
                      className={`
                        w-full justify-start gap-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:text-white" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="bg-white border-t border-gray-100 p-4">
        <div className="bg-slate-50 rounded-xl p-3 mb-2">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                H
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">Hamilton</p>
                <p className="text-xs text-slate-500 truncate">Administrador</p>
              </div>
           </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut} 
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 justify-center"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair do Sistema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

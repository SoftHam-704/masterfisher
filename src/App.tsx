import AdminCallback from "@/pages/AdminCallback";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuideRegister from "./pages/GuideRegister";
import SupplierRegister from "./pages/SupplierRegister";
import ServiceRegister from "./pages/ServiceRegister";
import BusinessRegister from "./pages/BusinessRegister";
import Dashboard from "./pages/Dashboard";
import FindServices from "./pages/FindServices";
import ServiceDetail from "./pages/ServiceDetail";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Destinations from "./pages/Destinations";
import About from "./pages/About";
import Blog from "./pages/Blog";
import ArticleView from "./pages/ArticleView";
import Ranking from "./pages/Ranking";


import SponsorDashboard from "./pages/SponsorDashboard";
import Admin from "./pages/Admin";
import PartnerCheckout from "./pages/PartnerCheckout";
import PartnerPaymentSuccess from "./pages/PartnerPaymentSuccess";
import PartnerPaymentCanceled from "./pages/PartnerPaymentCanceled";
import GuidePaymentSuccess from "./pages/GuidePaymentSuccess";
import GuidePaymentCanceled from "./pages/GuidePaymentCanceled";
import GuiasLanding from "./pages/GuiasLanding";
import TermsOfUse from "./pages/TermsOfUse";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <LanguageProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>

                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/cadastrar" element={<Register />} />
                            <Route path="/perfil" element={<Profile />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/encontrar-servicos" element={<FindServices />} />
                            <Route path="/servico/:id" element={<ServiceDetail />} />
                            <Route path="/cadastrar-servico" element={<ServiceRegister />} />
                            <Route path="/cadastrar-guia" element={<GuideRegister />} />
                            <Route path="/cadastrar-empresa" element={<BusinessRegister />} />
                            <Route path="/cadastro-guia" element={<GuideRegister />} />
                            <Route path="/cadastro-fornecedor" element={<SupplierRegister />} />
                            <Route path="/recuperar-senha" element={<ResetPassword />} />
                            <Route path="/atualizar-senha" element={<UpdatePassword />} />
                            <Route path="/destinos" element={<Destinations />} />
                            <Route path="/sobre" element={<About />} />
                            <Route path="/guias" element={<GuiasLanding />} />
                            <Route path="/termos-de-uso" element={<TermsOfUse />} />
                            <Route path="/termos" element={<TermsOfUse />} />
                            <Route path="/privacidade" element={<Privacy />} />
                            <Route path="/sponsor-dashboard" element={<SponsorDashboard />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<ArticleView />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/parceiro-checkout" element={<PartnerCheckout />} />
                            <Route path="/parceiro-pagamento-sucesso" element={<PartnerPaymentSuccess />} />
                            <Route path="/parceiro-pagamento-cancelado" element={<PartnerPaymentCanceled />} />
                            <Route path="/guia-pagamento-sucesso" element={<GuidePaymentSuccess />} />
                            <Route path="/guia-pagamento-cancelado" element={<GuidePaymentCanceled />} />
                            <Route path="/pagamento-sucesso" element={<GuidePaymentSuccess />} />
                            <Route path="/pagamento-cancelado" element={<GuidePaymentCanceled />} />
                            <Route path="/pagamento-pendente" element={<GuidePaymentSuccess />} />
                            <Route path="/ranking" element={<Ranking />} />
                            <Route path="/admin-callback" element={<AdminCallback />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>

                </BrowserRouter>
            </TooltipProvider>
        </LanguageProvider>
    </QueryClientProvider>
);

export default App;

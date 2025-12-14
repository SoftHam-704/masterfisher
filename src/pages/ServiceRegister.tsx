import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fish, Store, MapPin, Users, Star, ArrowLeft, TrendingUp, Shield, Award, CheckCircle2 } from "lucide-react";
import serviceRegisterBg from "@/assets/service-register-bg.jpg";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { PartnerForm } from "@/components/PartnerForm";
import { useEffect } from "react";

const ServiceRegister = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${serviceRegisterBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 px-4 w-full">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
            </div>
            
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/20 text-primary-foreground border-primary-foreground/30">
                Patrocínio Comercial
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 drop-shadow-lg">
                Divulgue sua Marca
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
                Alcance milhares de pescadores apaixonados e potencialize seu negócio com a maior plataforma de pesca do Brasil
              </p>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="p-6 backdrop-blur-sm bg-card/95 border-2 hover:border-primary transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-ocean rounded-full mb-4">
                    <TrendingUp className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aumente sua Visibilidade</h3>
                  <p className="text-muted-foreground">
                    Sua marca em destaque na plataforma para milhares de visitantes diários
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 backdrop-blur-sm bg-card/95 border-2 hover:border-primary transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-ocean rounded-full mb-4">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Público Qualificado</h3>
                  <p className="text-muted-foreground">
                    Conecte-se diretamente com pescadores e entusiastas da pesca esportiva
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 backdrop-blur-sm bg-card/95 border-2 hover:border-primary transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-ocean rounded-full mb-4">
                    <Award className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Destaque Premium</h3>
                  <p className="text-muted-foreground">
                    Logo em carrossel na página inicial com link direto para seu site
                  </p>
                </div>
              </Card>
            </div>

            {/* Pricing Section */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
                  Planos de Patrocínio
                </h2>
                <p className="text-lg text-primary-foreground/90 drop-shadow-md">
                  Escolha o plano ideal para sua empresa
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Monthly Plan */}
                <Card className="p-8 backdrop-blur-sm bg-card/95 border-2 hover:border-primary transition-all">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Plano Mensal</h3>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-primary">R$ 199</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Logo em carrossel na página inicial</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Link direto para seu website</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Estatísticas de visualizações e cliques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Suporte dedicado</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    Selecionar Mensal
                  </Button>
                </Card>

                {/* Annual Plan */}
                <Card className="p-8 backdrop-blur-sm bg-card/95 border-2 border-primary shadow-ocean relative overflow-hidden">
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                    Economize 20%
                  </Badge>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Plano Anual</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-primary">R$ 159</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through">R$ 2.388</span> por apenas <span className="font-bold text-primary">R$ 1.908/ano</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Logo em carrossel na página inicial</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Link direto para seu website</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Estatísticas de visualizações e cliques</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Suporte dedicado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-semibold">Destaque premium no topo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="font-semibold">2 meses grátis</span>
                    </li>
                  </ul>
                  
                  <Button variant="ocean" size="lg" className="w-full">
                    Selecionar Anual
                  </Button>
                </Card>
              </div>
            </div>

            {/* Contact CTA */}
            <Card className="p-8 backdrop-blur-sm bg-card/95 border-2 border-primary text-center">
              <h3 className="text-2xl font-bold mb-4">Tem dúvidas ou precisa de um plano personalizado?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Entre em contato conosco e nossa equipe criará uma proposta sob medida para sua empresa
              </p>
              <PartnerForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-90">
            © 2025 MasterFisher. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServiceRegister;
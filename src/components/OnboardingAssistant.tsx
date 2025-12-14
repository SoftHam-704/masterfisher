import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Fish, MapPin, User, ArrowRight } from "lucide-react";

export function OnboardingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('has_seen_onboarding')
      .eq('id', user.id)
      .single();

    if (profile && !profile.has_seen_onboarding) {
      setIsOpen(true);
    }
  };

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ has_seen_onboarding: true })
        .eq('id', user.id);
    }
    setIsOpen(false);
  };

  const steps = [
    {
      title: "Bem-vindo ao MasterFisher!",
      content: "Seu assistente inteligente para pesca esportiva. Vamos configurar sua experiência?",
      icon: <Fish className="w-12 h-12 text-primary mb-4" />,
      action: () => setStep(1),
      buttonText: "Começar"
    },
    {
      title: "Complete seu Perfil",
      content: "Adicione uma foto e suas preferências para receber recomendações personalizadas.",
      icon: <User className="w-12 h-12 text-primary mb-4" />,
      action: () => {
        navigate("/perfil");
        setStep(2);
      },
      buttonText: "Ir para Perfil"
    },
    {
      title: "Encontre Serviços",
      content: "Busque por guias, pesqueiros e lojas parceiras em sua região.",
      icon: <MapPin className="w-12 h-12 text-primary mb-4" />,
      action: () => {
        navigate("/encontrar-servicos");
        setStep(3);
      },
      buttonText: "Explorar Mapa"
    },
    {
      title: "Tudo Pronto!",
      content: "Você está pronto para começar sua jornada. Boa pescaria!",
      icon: <Fish className="w-12 h-12 text-primary mb-4" />,
      action: handleComplete,
      buttonText: "Concluir"
    }
  ];

  const currentStep = steps[step];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleComplete()}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">{currentStep.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          {currentStep.icon}
          <p className="text-lg text-muted-foreground">{currentStep.content}</p>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={currentStep.action} size="lg" className="w-full sm:w-auto">
            {currentStep.buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

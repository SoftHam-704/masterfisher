import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

export default function GuidePaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const token = searchParams.get('token');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate verification delay
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              {isVerifying ? (
                <>
                  <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
                  <CardTitle className="text-2xl">Verificando pagamento...</CardTitle>
                  <CardDescription>
                    Aguarde enquanto confirmamos sua transação
                  </CardDescription>
                </>
              ) : (
                <>
                  <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                  <CardTitle className="text-2xl">Pagamento realizado com sucesso!</CardTitle>
                  <CardDescription>
                    Seu pagamento foi confirmado e seu cadastro está sendo processado
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {!isVerifying && (
                <>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <h3 className="font-semibold">Próximos passos:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Você receberá um email de confirmação</li>
                      <li>Aguarde a aprovação do seu cadastro (até 24 horas)</li>
                      <li>Após aprovação, você poderá completar seu perfil</li>
                      <li>Comece a receber clientes através da plataforma!</li>
                    </ol>
                  </div>

                  {token && (
                    <div className="text-sm text-muted-foreground bg-secondary p-3 rounded">
                      <p className="font-medium mb-1">Token de registro:</p>
                      <code className="text-xs break-all">{token}</code>
                      <p className="mt-2 text-xs">Guarde este token para futuras referências</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      onClick={() => navigate('/')}
                      className="flex-1"
                      variant="outline"
                    >
                      Voltar para Home
                    </Button>
                    <Button 
                      onClick={() => navigate('/auth')}
                      className="flex-1"
                    >
                      Fazer Login
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


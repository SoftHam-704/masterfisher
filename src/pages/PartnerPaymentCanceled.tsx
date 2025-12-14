import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function PartnerPaymentCanceled() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
              <CardTitle className="text-2xl">Pagamento cancelado</CardTitle>
              <CardDescription>
                O processo de pagamento foi cancelado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Não se preocupe! Você pode tentar novamente quando quiser.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1"
                  variant="outline"
                >
                  Voltar para Home
                </Button>
                <Button 
                  onClick={() => navigate('/parceiro-checkout')}
                  className="flex-1"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

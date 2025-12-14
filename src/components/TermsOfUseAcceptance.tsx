import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface TermsOfUseAcceptanceProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
}

export function TermsOfUseAcceptance({ checked, onCheckedChange, required = true }: TermsOfUseAcceptanceProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-start space-x-2 p-4 border border-border rounded-lg bg-muted/30">
      <Checkbox 
        id="terms" 
        checked={checked}
        onCheckedChange={onCheckedChange}
        required={required}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Li e aceito os{" "}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-primary underline inline"
                type="button"
              >
                Termos de Uso da Plataforma
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  TERMO DE USO DA PLATAFORMA MASTERFISHER
                </DialogTitle>
                <DialogDescription>
                  Razão Social: HAMILTON LUIZ R. DA SILVA - ME<br />
                  CNPJ: 17.504.829/0001-24<br />
                  Nome Fantasia: SOFTHAM SISTEMAS COMERCIAIS
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6 text-sm">
                  <section>
                    <h3 className="font-bold text-base mb-2">1. OBJETO</h3>
                    <p className="text-muted-foreground">
                      A plataforma MASTERFISHER, mantida pela empresa SOFTHAM SISTEMAS COMERCIAIS, tem por objetivo 
                      conectar pescadores amadores (turistas), guias de pesca e lojas do setor, atuando exclusivamente 
                      como intermediadora dessas relações comerciais, sem participação direta nas contratações, 
                      negociações e transações entre os usuários cadastrados.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">2. ACEITAÇÃO DOS TERMOS</h3>
                    <p className="text-muted-foreground">
                      Ao acessar e utilizar a plataforma MASTERFISHER, o usuário declara estar ciente e de acordo com 
                      todas as condições descritas neste Termo de Uso, responsabilizando-se integralmente pela 
                      veracidade das informações fornecidas e pelo cumprimento das normas aqui estabelecidas.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">3. LIMITAÇÃO DE RESPONSABILIDADE</h3>
                    <p className="text-muted-foreground mb-2">
                      A SOFTHAM SISTEMAS COMERCIAIS não participa das relações contratuais entre guias, turistas e 
                      lojas vinculadas. Assim, não responde por:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Qualidade, pontualidade ou veracidade dos serviços/produtos ofertados por terceiros;</li>
                      <li>Cancelamentos, cobranças indevidas, prejuízos financeiros, danos pessoais ou materiais 
                          decorrentes das interações entre usuários;</li>
                      <li>Reclamações, denúncias, divergências comerciais ou jurídicas oriundas dessas relações.</li>
                    </ul>
                    <p className="text-muted-foreground mt-2">
                      O usuário reconhece que toda contratação é realizada sob sua responsabilidade, devendo 
                      certificar-se das condições, histórico e idoneidade do parceiro comercial.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">4. MEDIAÇÃO DE CONFLITOS</h3>
                    <p className="text-muted-foreground">
                      Caso haja reclamações ou divergências, a plataforma disponibiliza canal de comunicação para 
                      tentativa de mediação extrajudicial, sem garantia de solução ou ressarcimento, limitando-se a 
                      promover a mediação e registro de ocorrências.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">5. USO DE DADOS E COMUNICAÇÕES</h3>
                    <p className="text-muted-foreground">
                      Todas as trocas de mensagens, agendamentos, pagamentos, avaliações e denúncias devem ocorrer, 
                      preferencialmente, dentro da plataforma, ficando armazenadas para futura análise em casos de 
                      disputa.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">6. POLÍTICA DE PRIVACIDADE</h3>
                    <p className="text-muted-foreground">
                      Os dados cadastrados serão tratados conforme a Lei Geral de Proteção de Dados (LGPD), com 
                      transparência, segurança e finalidade exclusiva de funcionamento do portal.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">7. ALTERAÇÕES NO TERMO DE USO</h3>
                    <p className="text-muted-foreground">
                      A SOFTHAM SISTEMAS COMERCIAIS reserva-se o direito de alterar este Termo de Uso a qualquer tempo, 
                      mediante aviso prévio aos usuários por meio do próprio site.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-bold text-base mb-2">8. FORO</h3>
                    <p className="text-muted-foreground">
                      Fica eleito o foro da comarca de Campo Grande - MS, Estado do Mato Grosso do Sul, Brasil, para 
                      dirimir quaisquer dúvidas oriundas deste Termo de Uso, com renúncia de qualquer outro por mais 
                      privilegiado que seja.
                    </p>
                  </section>

                  <div className="border-t pt-4 mt-6">
                    <p className="text-sm font-medium">
                      Declaro que li, compreendi e aceito os termos acima.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    onCheckedChange(true);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  Aceitar Termos
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {required && <span className="text-destructive">*</span>}
        </Label>
        <p className="text-xs text-muted-foreground">
          É necessário aceitar os termos para continuar com o cadastro.
        </p>
      </div>
    </div>
  );
}

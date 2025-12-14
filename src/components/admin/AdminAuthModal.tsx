import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ADMIN_EMAIL = 'softham2008@gmail.com';

export const AdminAuthModal = ({ open, onOpenChange }: AdminAuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Primeiro verifica se já está logado como admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.email === ADMIN_EMAIL) {
      // Já está logado como admin, vai direto
      onOpenChange(false);
      navigate('/admin');
      return;
    }
    
    // Se não está logado ou não é admin, faz login
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin-callback`
      }
    });

    if (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       toast({
        title: 'Erro ao fazer login',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (data.user) {
        if (data.user.email === ADMIN_EMAIL) {
            onOpenChange(false);
            navigate('/admin');
        } else {
             toast({
                title: 'Acesso negado',
                description: 'Este usuário não tem permissão de administrador.',
                variant: 'destructive',
            });
            await supabase.auth.signOut();
            setIsLoading(false);
        }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card-dark border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-heading">
            Painel Administrativo
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Faça login para acessar o painel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
            <div className="space-y-2">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            </div>

            <Button
            onClick={handleEmailLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
            >
            {isLoading ? (
                <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
                </>
            ) : (
                "Entrar com Email"
            )}
            </Button>

            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f172a] px-2 text-muted-foreground">
                Ou continue com
                </span>
            </div>
            </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Apenas o administrador autorizado pode acessar este painel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

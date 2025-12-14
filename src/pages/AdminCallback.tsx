import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';

const ADMIN_EMAIL = 'softham2008@gmail.com';

export default function AdminCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'denied'>('loading');

  useEffect(() => {
    let isProcessed = false;

    // Funcao para verificar se e admin
    const checkAdminAndRedirect = async (email: string | undefined) => {
      if (isProcessed) return;
      isProcessed = true;

      if (email === ADMIN_EMAIL) {
        setStatus('success');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setStatus('denied');
        await supabase.auth.signOut();
        setTimeout(() => navigate('/'), 3000);
      }
    };

    // Escuta mudancas de autenticacao (importante para processar o callback OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Admin Callback - Auth event:', event, 'User:', session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user) {
        await checkAdminAndRedirect(session.user.email);
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          await checkAdminAndRedirect(session.user.email);
        } else {
          // Aguarda um pouco para o OAuth processar
          setTimeout(async () => {
            if (!isProcessed) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await checkAdminAndRedirect(user.email);
              } else {
                setStatus('denied');
                setTimeout(() => navigate('/'), 3000);
              }
            }
          }, 2000);
        }
      }
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Verificando acesso...</h1>
            <p className="text-gray-400">Aguarde enquanto verificamos suas credenciais</p>
          </>
        )}

        {status === 'success' && (
          <>
            <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acesso Autorizado!</h1>
            <p className="text-gray-400">Redirecionando para o painel...</p>
          </>
        )}

        {status === 'denied' && (
          <>
            <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
            <p className="text-gray-400">Voce nao tem permissao para acessar o painel administrativo</p>
            <p className="text-gray-500 text-sm mt-2">Redirecionando para a pagina inicial...</p>
          </>
        )}
      </div>
    </div>
  );
}

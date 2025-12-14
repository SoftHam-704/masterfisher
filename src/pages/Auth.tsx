import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

const Auth = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        window.scrollTo(0, 0);

        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                navigate("/perfil");
            }
        };
        checkUser();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/perfil`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            setIsLoading(false);
            toast({
                title: "Erro no login com Google",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("signin-email") as string;
        const password = formData.get("signin-password") as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setIsLoading(false);

        if (error) {
            toast({
                title: "Erro ao fazer login",
                description: error.message,
                variant: "destructive",
            });
            return;
        }

        navigate("/perfil");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-ocean">
                <div className="w-full max-w-md">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="mb-6 text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar ao início
                    </Button>

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">{t('common.welcome')}</CardTitle>
                            <CardDescription>
                                {t('common.signInDescription')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 mb-4">
                                <Button
                                    type="button"
                                    className="w-full h-14 text-lg font-medium relative bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                >
                                    <svg className="h-6 w-6 mr-3 bg-white rounded-full p-1 text-blue-600" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                    </svg>
                                    Entrar com Google
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">
                                            Ou continue com email
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div>
                                    <Label htmlFor="signin-email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="signin-email"
                                        name="signin-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="signin-password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Senha
                                    </Label>
                                    <div className="relative mt-2">
                                        <Input
                                            id="signin-password"
                                            name="signin-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Entrando..." : "Entrar"}
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/recuperar-senha")}
                                        className="text-sm text-primary hover:underline font-medium"
                                    >
                                        Esqueceu sua senha?
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

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

export default Auth;

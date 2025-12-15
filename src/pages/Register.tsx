import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import { TermsOfUseAcceptance } from "@/components/TermsOfUseAcceptance";
import { User, Mail, Lock, ArrowLeft, Users, Info, Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [userType, setUserType] = useState<string>("tourist");
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
                title: "Erro no cadastro com Google",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast({
                title: "Termos não aceitos",
                description: "É necessário aceitar os Termos de Uso para criar sua conta.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("signup-email") as string;
        const password = formData.get("signup-password") as string;
        const displayName = formData.get("display-name") as string;

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                    user_type: userType,
                },
                emailRedirectTo: `${window.location.origin}/perfil`,
            },
        });

        setIsLoading(false);

        if (error) {
            toast({
                title: "Erro ao criar conta",
                description: error.message,
                variant: "destructive",
            });
            return;
        }



        toast({
            title: "Conta criada com sucesso! 📧",
            description: "Verifique seu email para confirmar o cadastro.",
            duration: 6000,
        });

        // Redirect to login page
        navigate("/auth");
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-ocean">
                <div className="w-full max-w-md">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/auth")}
                        className="mb-6 text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar ao login
                    </Button>

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl">Criar Conta</CardTitle>
                            <CardDescription>
                                Preencha os dados abaixo para criar sua conta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert className="mb-6 border-blue-200 bg-blue-50">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-sm text-blue-900">
                                    <strong>Importante:</strong> Após criar sua conta, você receberá um email de confirmação.
                                    <span className="font-semibold"> Clique no link enviado para ativar sua conta</span> e poder fazer login no portal.
                                </AlertDescription>
                            </Alert>

                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div>
                                    <Label htmlFor="display-name" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nome
                                    </Label>
                                    <Input
                                        id="display-name"
                                        name="display-name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        required
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="signup-email"
                                        name="signup-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        Senha
                                    </Label>
                                    <div className="relative mt-2">
                                        <Input
                                            id="signup-password"
                                            name="signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
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
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Mínimo de 6 caracteres
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="user-type" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Tipo de Conta
                                    </Label>
                                    <Select value={userType} onValueChange={setUserType}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Selecione o tipo de conta" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">🎣 Pescador/Turista</SelectItem>
                                            <SelectItem value="guide">🧭 Guia de Pesca</SelectItem>
                                            <SelectItem value="supplier">🏪 Fornecedor/Empresa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Você pode alterar isso posteriormente se necessário
                                    </p>
                                </div>

                                <TermsOfUseAcceptance
                                    checked={termsAccepted}
                                    onCheckedChange={setTermsAccepted}
                                    required
                                />

                                <div className="space-y-3 pt-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="w-full h-12 text-base font-medium relative hover:bg-slate-50 transition-colors"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                    >
                                        <svg className="h-5 w-5 mr-2 absolute left-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                        </svg>
                                        Cadastrar com Google
                                    </Button>

                                    <div className="relative flex items-center justify-center my-2">
                                        <span className="w-full border-t absolute" />
                                        <span className="bg-background px-2 text-xs text-muted-foreground uppercase relative">
                                            OU
                                        </span>
                                    </div>

                                    <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || !termsAccepted}>
                                        {isLoading ? "Criando conta..." : "Cadastrar com email"}
                                    </Button>
                                </div>

                                <div className="text-center mt-4 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/auth")}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        Já tem uma conta?{" "}
                                        <span className="underline font-medium">Faça login</span>
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

export default Register;

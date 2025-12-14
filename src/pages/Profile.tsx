import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BookingsList from "@/components/BookingsList";
import LoyaltyCard from "@/components/LoyaltyCard";
import BadgesDisplay from "@/components/BadgesDisplay";
import RewardsShop from "@/components/RewardsShop";
import { User, Mail, Phone, LogOut, Camera } from "lucide-react";
import GalleryUpload from "@/components/GalleryUpload";
import UserGallery from "@/components/UserGallery";


interface Profile {
    id: string;
    user_id: string;
    display_name: string | null;
    phone: string | null;
    bio: string | null;
    avatar_url: string | null;
}

const Profile = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [galleryRefresh, setGalleryRefresh] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        let isMounted = true;

        const checkUserAndLoadProfile = async () => {

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session?.user) {
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    if (isMounted) {
                        setIsCheckingAuth(false);
                        navigate("/auth");
                    }
                    return;
                }

                if (!isMounted) return;
                setUserId(user.id);
                setUserEmail(user.email || null);
            } else {
                if (!isMounted) return;
                setUserId(session.user.id);
                setUserEmail(session.user.email || null);
            }

            const currentUserId = session?.user?.id || userId;
            if (!currentUserId) {
                if (isMounted) {
                    setIsCheckingAuth(false);
                    navigate("/auth");
                }
                return;
            }

            const { data: profileData, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", currentUserId)
                .single();

            if (isMounted && !error && profileData) {
                setProfile(profileData);
                setName(profileData.display_name || "");
                setPhone(profileData.phone || "");
                setBio(profileData.bio || "");
            }

            if (isMounted) {
                setIsCheckingAuth(false);
            }
        };

        checkUserAndLoadProfile();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!userId || !e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Tipo de arquivo inválido",
                description: "Por favor, selecione uma imagem",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const compressImage = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target?.result as string;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 512;
                            const MAX_HEIGHT = 512;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                        };
                        img.onerror = (error) => reject(error);
                    };
                    reader.onerror = (error) => reject(error);
                });
            };

            const base64String = await compressImage(file);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: base64String })
                .eq('id', userId);

            if (updateError) throw updateError;

            setProfile((prev) => {
                if (!prev) return prev;
                return { ...prev, avatar_url: base64String };
            });

            window.dispatchEvent(new CustomEvent('profile-updated'));

            toast({
                title: "Foto atualizada com sucesso!",
            });
        } catch (error: any) {
            toast({
                title: "Erro ao atualizar foto",
                description: error.message || "Tente uma imagem menor.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setIsLoading(true);

        try {
            
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    display_name: name.trim() || null,
                    phone: phone.trim() || null,
                    bio: bio.trim() || null,
                })
                .eq('id', userId)
                .select()
                .maybeSingle();
            

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error('Perfil não encontrado. Verifique se você está logado.');
            }

            setProfile(data);
            setName(data.display_name || "");
            setPhone(data.phone || "");
            setBio(data.bio || "");

            window.dispatchEvent(new CustomEvent('profile-updated'));

            toast({
                title: "Perfil atualizado!",
                description: "Suas informações foram salvas com sucesso.",
            });
        } catch (error: any) {
            toast({
                title: "Erro ao atualizar perfil",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    if (isCheckingAuth) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Carregando perfil...</p>
            </div>
        );
    }

    if (!userId) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="container mx-auto max-w-5xl px-4 py-8 pt-24 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={profile?.avatar_url || ""} alt={name || "User"} />
                                <AvatarFallback className="text-2xl">
                                    {name ? name[0].toUpperCase() : <User />}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="h-6 w-6 text-white" />
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{name || "Usuário"}</h1>
                            <p className="text-muted-foreground">{userEmail}</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair da Conta
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="gallery">Galeria</TabsTrigger>
                        <TabsTrigger value="bookings">Reservas</TabsTrigger>
                        <TabsTrigger value="loyalty">Fidelidade</TabsTrigger>
                        <TabsTrigger value="rewards">Recompensas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Perfil</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <Label htmlFor="name" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Nome
                                        </Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            value={userEmail || ""}
                                            disabled
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            O email não pode ser alterado
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Telefone
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="bio">Sobre Você</Label>
                                        <Textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Conte um pouco sobre você e suas experiências de pesca..."
                                            rows={4}
                                            maxLength={500}
                                            className="mt-2"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="gallery" className="space-y-6">
                        <GalleryUpload userId={userId} onUploadSuccess={() => setGalleryRefresh(prev => prev + 1)} />
                        <Card>
                            <CardHeader>
                                <CardTitle>Minhas Fotos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <UserGallery userId={userId} refreshTrigger={galleryRefresh} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Minhas Reservas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BookingsList userId={userId} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="loyalty" className="space-y-6">
                        <LoyaltyCard />
                        <BadgesDisplay />
                    </TabsContent>

                    <TabsContent value="rewards">
                        <RewardsShop />
                    </TabsContent>
                </Tabs>
            </div>

            <footer className="bg-primary text-primary-foreground py-8 px-4 mt-auto">
                <div className="container mx-auto text-center">
                    <p className="text-sm opacity-90">
                        © 2025 MasterFisher. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};
export default Profile;

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, Store, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import LogoUpload from "@/components/LogoUpload";

const supplierSchema = z.object({
  company_name: z.string().min(3, "Nome da empresa obrigatório"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  responsible_name: z.string().min(3, "Nome do responsável obrigatório"),
  responsible_cpf: z.string().min(11, "CPF do responsável inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Endereço obrigatório"),
  category: z.string().min(3, "Categoria obrigatória"),
  description: z.string().min(10, "Descreva a empresa"),
  products_services: z.string().min(10, "Descreva produtos/serviços"),
  operating_hours: z.string().min(3, "Horário de funcionamento obrigatório"),
  payment_methods: z.string().min(3, "Formas de pagamento obrigatórias"),
  delivery_options: z.string().optional(),
  instagram_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

const SupplierRegister = () => {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para cadastrar um perfil",
          variant: "destructive",
        });
        return;
      }

      // Upload image
      let imageUrl: string | null = null;
      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('supplier-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('supplier-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        setUploading(false);
      }

      // Save supplier data
      const supplierData: any = {
        user_id: user.id,
        company_name: data.company_name,
        cnpj: data.cnpj,
        responsible_name: data.responsible_name,
        responsible_cpf: data.responsible_cpf,
        phone: data.phone,
        email: data.email,
        address: data.address,
        category: data.category,
        description: data.description,
        products_services: data.products_services,
        operating_hours: data.operating_hours,
        payment_methods: data.payment_methods,
        delivery_options: data.delivery_options || null,
        facade_image: imageUrl,
        logo_url: logoUrl,
        approval_status: 'pending',
        instagram_url: data.instagram_url || null,
        facebook_url: data.facebook_url || null,
        youtube_url: data.youtube_url || null,
        website_url: data.website_url || null,
      };
      
      const { error } = await (supabase as any).from('suppliers').insert(supplierData);
      // Update user profile to mark as supplier
      await supabase
        .from('profiles')
        .update({ user_type: 'supplier' })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Seu perfil de fornecedor foi cadastrado com sucesso!",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
          
          <Card className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-ocean rounded-lg">
                  <Store className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Cadastro de Fornecedor</h1>
              </div>
              <p className="text-muted-foreground">
                Preencha os dados da sua empresa para começar a oferecer seus serviços
              </p>
            </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company_name">Nome da Empresa *</Label>
                <Input
                  id="company_name"
                  {...register("company_name")}
                  className="mt-2"
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive mt-1">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  {...register("cnpj")}
                  placeholder="00.000.000/0000-00"
                  className="mt-2"
                />
                {errors.cnpj && (
                  <p className="text-sm text-destructive mt-1">{errors.cnpj.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_name">Nome do Responsável *</Label>
                <Input
                  id="responsible_name"
                  {...register("responsible_name")}
                  className="mt-2"
                />
                {errors.responsible_name && (
                  <p className="text-sm text-destructive mt-1">{errors.responsible_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="responsible_cpf">CPF do Responsável *</Label>
                <Input
                  id="responsible_cpf"
                  {...register("responsible_cpf")}
                  placeholder="000.000.000-00"
                  className="mt-2"
                />
                {errors.responsible_cpf && (
                  <p className="text-sm text-destructive mt-1">{errors.responsible_cpf.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(00) 00000-0000"
                  className="mt-2"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  className="mt-2"
                />
                {errors.address && (
                  <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  {...register("category")}
                  placeholder="Ex: Hotel, Restaurante, Loja"
                  className="mt-2"
                />
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="operating_hours">Horário de Funcionamento *</Label>
                <Input
                  id="operating_hours"
                  {...register("operating_hours")}
                  placeholder="Ex: Seg-Sex 8h-18h"
                  className="mt-2"
                />
                {errors.operating_hours && (
                  <p className="text-sm text-destructive mt-1">{errors.operating_hours.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="payment_methods">Formas de Pagamento *</Label>
                <Input
                  id="payment_methods"
                  {...register("payment_methods")}
                  placeholder="Dinheiro, Cartão, PIX"
                  className="mt-2"
                />
                {errors.payment_methods && (
                  <p className="text-sm text-destructive mt-1">{errors.payment_methods.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="delivery_options">Opções de Entrega</Label>
                <Input
                  id="delivery_options"
                  {...register("delivery_options")}
                  placeholder="Entrega local, Correios"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição da Empresa *</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
                placeholder="Conte sobre sua empresa"
                className="mt-2"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="products_services">Produtos e Serviços *</Label>
              <Textarea
                id="products_services"
                {...register("products_services")}
                rows={4}
                placeholder="Descreva os produtos e serviços oferecidos"
                className="mt-2"
              />
              {errors.products_services && (
                <p className="text-sm text-destructive mt-1">{errors.products_services.message}</p>
              )}
            </div>

            <div>
              <LogoUpload
                onUploadComplete={(url) => setLogoUrl(url)}
                currentLogoUrl={logoUrl}
              />
            </div>

            {/* Redes Sociais */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Redes Sociais (opcional)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="instagram_url">Instagram</Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    {...register("instagram_url")}
                    placeholder="https://instagram.com/suaempresa"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook_url">Facebook</Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    {...register("facebook_url")}
                    placeholder="https://facebook.com/suaempresa"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube_url">YouTube</Label>
                  <Input
                    id="youtube_url"
                    type="url"
                    {...register("youtube_url")}
                    placeholder="https://youtube.com/@seucanal"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="website_url">Website</Label>
                  <Input
                    id="website_url"
                    type="url"
                    {...register("website_url")}
                    placeholder="https://seusite.com.br"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="ocean"
              size="lg"
              className="w-full"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting || uploading ? t('common.registering') : t('common.registerCompany')}
            </Button>
          </form>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegister;
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  views: number;
  created_at: string;
  category_id: string;
  article_categories: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [articlesRes, categoriesRes] = await Promise.all([
      supabase
        .from('articles' as any)
        .select('*, article_categories(name, slug)')
        .eq('published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('article_categories' as any)
        .select('*')
        .order('name')
    ]);

    if (articlesRes.data) setArticles(articlesRes.data as any);
    if (categoriesRes.data) setCategories(categoriesRes.data as any);
    setLoading(false);
  };

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(a => a.article_categories?.slug === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/3" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-ocean text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Blog MasterFisher</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl">
            Dicas, técnicas e novidades do mundo da pesca
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.slug}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            {filteredArticles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum artigo disponível nesta categoria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <Card 
                    key={article.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/blog/${article.slug}`)}
                  >
                    {article.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {article.article_categories?.name}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDistanceToNow(new Date(article.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views} visualizações
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Blog;
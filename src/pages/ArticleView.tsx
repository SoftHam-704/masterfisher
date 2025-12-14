import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  views: number;
  created_at: string;
  author_id: string;
  article_categories: {
    name: string;
  };
  profiles: {
    full_name: string;
  };
}

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    const { data, error } = await supabase
      .from('articles' as any)
      .select('*, article_categories(name), profiles(full_name)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article:', error);
      navigate('/blog');
      return;
    }

    if (!data) {
      navigate('/blog');
      return;
    }

    const articleData = data as any;
    setArticle(articleData);
    
    // Increment view count
    if (articleData.id) {
      await supabase.rpc('increment_article_views' as any, { article_id: articleData.id });
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o Blog
        </Button>

        <article className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-2">
              {article.article_categories?.name}
            </Badge>
            <h1 className="text-4xl font-bold">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.profiles?.full_name || 'Anônimo'}
              </span>
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
          </div>

          {article.image_url && (
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticleView;
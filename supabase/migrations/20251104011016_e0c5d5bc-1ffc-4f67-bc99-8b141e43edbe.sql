-- Fix increment_article_views to validate article exists before incrementing
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only increment if article exists and is published
  UPDATE public.articles
  SET views = views + 1
  WHERE id = article_id 
    AND status = 'published'
    AND EXISTS (SELECT 1 FROM public.articles WHERE id = article_id);
END;
$$;
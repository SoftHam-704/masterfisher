-- Update handle_new_user function to use user_type from metadata
-- and ensure it doesn't reference the removed user_id column

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, user_type)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'display_name',
    COALESCE(new.raw_user_meta_data->>'user_type', 'user')
  );
  RETURN new;
END;
$$;

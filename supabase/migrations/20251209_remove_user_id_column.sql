-- Remove redundant user_id column from profiles table
-- Keep only id as primary key

-- Step 1: Check if there are any rows where id != user_id
-- (This should return 0 rows if data is consistent)
DO $$
DECLARE
  inconsistent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO inconsistent_count
  FROM public.profiles
  WHERE id != user_id;
  
  IF inconsistent_count > 0 THEN
    RAISE EXCEPTION 'Found % rows where id != user_id. Data migration needed!', inconsistent_count;
  END IF;
END $$;

-- Step 2: Drop the user_id column
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS user_id;

-- Step 3: Add comment to document the change
COMMENT ON TABLE public.profiles IS 'User profiles. id column references auth.users(id)';

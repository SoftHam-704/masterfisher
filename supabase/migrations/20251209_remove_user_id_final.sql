-- Remove redundant user_id column from profiles table
-- Step 1: Drop foreign key constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Step 2: Drop unique constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Step 3: Drop the user_id column
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS user_id;

-- Step 4: Verify column was removed
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

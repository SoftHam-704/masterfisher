-- Alter profiles table to store avatar as base64
ALTER TABLE profiles 
ALTER COLUMN avatar_url TYPE TEXT;
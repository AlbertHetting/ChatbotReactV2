-- Migration: Add user_id column to threads table
-- This migration can be run in Supabase's SQL Editor to update an existing database
-- Run this script if you already have threads in your database from previous PRs

-- Step 1: Add user_id column (nullable initially)
-- We make it nullable first so we can populate it with existing user data
ALTER TABLE threads 
ADD COLUMN user_id uuid;

-- Step 2: Set user_id for all existing threads
-- Assign all existing threads to the first user in auth.users
-- In a real migration, you might assign based on creation date, session logs, etc.
UPDATE threads 
SET user_id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL
-- Now that all threads have a user_id, we can enforce the constraint
ALTER TABLE threads 
ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Add foreign key constraint
-- This ensures referential integrity between threads and users
ALTER TABLE threads 
ADD CONSTRAINT threads_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Step 5: Create index for performance
-- This improves query performance when filtering threads by user
CREATE INDEX IF NOT EXISTS threads_user_id_idx ON threads(user_id);

-- Migration complete!
-- All existing threads now belong to the first user account
-- New threads will require a user_id (enforced by backend)

# Supabase Database Setup

This folder contains the database migration for Better Auth authentication.

## Quick Start

### Option 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Link your Supabase project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run the migration:**
   ```bash
   supabase db push
   ```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/20250115000000_better_auth_schema.sql`
4. Paste and run the SQL

### Option 3: Using Supabase MCP (Automated)

If you're using an AI assistant with Supabase MCP access:

```
Apply the migration file to my Supabase project
```

## What This Migration Creates

### Tables

1. **`user`** - Core authentication data
   - Email, password (hashed), verification status
   - Created/updated timestamps

2. **`session`** - User sessions
   - Session tokens, expiry dates
   - IP address and user agent tracking

3. **`account`** - OAuth providers & passwords
   - OAuth tokens for social login
   - Password hashes for email/password auth

4. **`verification`** - Email verification & password reset
   - Verification tokens with expiry
   - Used for email verification and password reset flows

5. **`profiles`** - Extended user data
   - First name, last name, username
   - Avatar URL
   - Links to `user` table via `user_id`

### Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ Users can only access their own data
- ✅ Service role has full access for Better Auth operations
- ✅ Proper foreign key constraints with CASCADE deletes
- ✅ Indexes for optimal query performance

### Auto-Update Triggers

All tables have automatic `updatedAt` timestamp updates via database triggers.

## Verifying the Migration

After running the migration, verify it worked:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user', 'session', 'account', 'verification', 'profiles');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user', 'session', 'account', 'verification', 'profiles');
```

You should see all 5 tables with RLS enabled (`rowsecurity = true`).

## Troubleshooting

### Error: "relation already exists"

If you see this error, the tables already exist. You can either:
- Drop the existing tables and re-run the migration
- Skip this migration if the schema is already correct

### Error: "permission denied"

Make sure you're using the service role key or have proper database permissions.

### RLS Policies Not Working

Verify that:
1. RLS is enabled on all tables
2. Your `auth.uid()` function is working correctly
3. You're using the correct service role key in Better Auth config

## Next Steps

After running this migration:

1. ✅ Set up your `.env.local` file with database credentials
2. ✅ Configure Better Auth in `lib/auth.ts`
3. ✅ Test authentication flows (sign up, sign in, password reset)
4. ✅ Verify RLS policies are working correctly

## Support

For issues or questions:
- Better Auth Docs: https://www.better-auth.com/docs
- Supabase Docs: https://supabase.com/docs
- This template's documentation: See main README.md

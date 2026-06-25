# KairoTask - Production Setup Guide

## Required Environment Variables

Set these in your production platform (Vercel, Netlify, Railway, etc.):

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xyz.supabase.co`) | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only, never expose to client) | ✅ Yes |
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g., `https://kairo.app`) | ✅ Yes |

## Supabase Configuration

### 1. Auth Settings (Supabase Dashboard → Authentication → Settings)
- **Site URL**: Set to your production domain (e.g., `https://kairo.app`)
- **Redirect URLs**: Add `https://kairo.app/**` and `http://localhost:3000/**` for local dev

### 2. RLS Policies Verification
Run this SQL in Supabase SQL Editor to verify RLS works:

```sql
-- Test as authenticated user (run after logging in)
SELECT auth.uid() as current_user_id;

-- Test project creation (should succeed for authenticated users)
INSERT INTO projects (name, owner_id) VALUES ('Test Project', auth.uid());

-- Verify the project was created
SELECT * FROM projects WHERE owner_id = auth.uid();
```

### 3. Realtime Publication
Ensure these tables are in the `supabase_realtime` publication:
- `projects`
- `tasks`
- `project_members`
- `task_comments`
- `activity_log`
- `notifications`
- `pomodoro_sessions`
- `sprints`
- `sprint_tasks`
- `task_dependencies`
- `project_invitations`
- `task_custom_fields`
- `task_custom_field_values`
- `project_webhooks`
- `webhook_queue`
- `task_attachments`

Check with:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

## Deployment Checklist

### Before Deploy
- [ ] All 4 environment variables set in production
- [ ] Supabase Site URL matches production domain
- [ ] Supabase Redirect URLs include production domain
- [ ] RLS policies tested with a real user account
- [ ] Build passes locally (`pnpm build`)

### After Deploy
- [ ] Visit production URL - should redirect to `/login`
- [ ] Register a new account
- [ ] Create a project - should succeed without errors
- [ ] Verify project appears in projects list
- [ ] Test real-time updates (open two browsers, create task in one)

## Common Production Issues

### "Cannot create project" / "Row-level security policy violation"
**Cause**: Auth cookie not persisting, or `owner_id` mismatch
**Fix**: 
1. Verify middleware.ts is deployed (handles cookie refresh)
2. Check `NEXT_PUBLIC_SITE_URL` matches exactly (including protocol)
3. Ensure user is fully authenticated before mutation

### "User not found" / `auth.uid()` returns null
**Cause**: Middleware not running or cookies not being set
**Fix**:
1. Check middleware.ts is in project root (not in `src/`)
2. Verify `@supabase/ssr` is installed
3. Check browser cookies for `sb-*-auth-token`

### Auth redirect loops
**Cause**: Middleware and server layout both redirecting
**Fix**: 
- Middleware handles unauthenticated → `/login`
- Server layout in `(dashboard)/layout.tsx` handles authenticated check
- They should not conflict

## Architecture Overview

```
middleware.ts          → Handles auth cookie refresh + route protection (Edge Runtime)
app/(dashboard)/layout.tsx → Server-side auth guard + data fetching (Node.js Runtime)
hooks/useProjects.ts   → Client-side data fetching + auth state sync (React)
components/project/CreateProjectModal.tsx → Uses shared auth state from hook
```

## Debugging Commands

```bash
# Local build test
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test Supabase connection locally
npx supabase status
```

## Vercel-Specific Notes

1. **Environment Variables**: Add all 4 vars in Vercel Dashboard → Settings → Environment Variables
2. **Build Command**: `pnpm build` (default)
3. **Output Directory**: `.next` (default)
4. **Install Command**: `pnpm install` (auto-detected from package.json)
5. **Framework Preset**: Next.js (auto-detected)

## Troubleshooting

If project creation still fails in production:
1. Open browser DevTools → Network tab
2. Filter by "projects" 
3. Look for POST to `/rest/v1/projects`
4. Check response - 401 = auth issue, 403 = RLS issue
5. Check console for Supabase client errors
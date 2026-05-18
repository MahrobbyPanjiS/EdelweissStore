**Supabase Setup (EdelweissStore)**

- API URL: https://khbqnxnjizdqmdijnjoz.supabase.co
- Anon key: (provided by user)

Recommended tables and columns (see `supabase/schema.sql`):
- `products`: id (uuid), name, price (integer), description, category, image_url, stats (jsonb), created_at
- `slides`: id (bigserial), url, created_at
- `news`: id (bigserial), title, tag, content, created_at

Client usage
- Add environment variables in your frontend: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The code uses `src/lib/supabaseClient.ts` which falls back to the provided URL/key if env vars are missing.

Security notes
- Use Row Level Security (RLS) for protecting write operations. For public listing (SELECT) you can allow anon read access, but restrict inserts/updates/deletes to authenticated admin users.
- Example policy: allow insert/update/delete only for authenticated users with a custom `is_admin` claim.

Next steps to fully integrate
1. Run SQL in `supabase/schema.sql` inside Supabase SQL editor.
2. Populate initial rows (or use your CMS) for `slides`, `news`, and `products`.
3. Add RLS policies and configure service_role for backend tasks if needed.
4. Run `npm install` to add `@supabase/supabase-js`.

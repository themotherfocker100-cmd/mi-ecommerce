# Deploying the secure orders endpoint (serverless)

This repo contains `api/create-order.js` — a serverless function that receives order payloads and inserts them into Supabase using the **service_role** key (keep it secret).

How to deploy (recommended: Vercel)
1. Sign in to Vercel and import this GitHub repo.
2. In the Vercel project settings, add the following Environment Variables:
   - `SUPABASE_URL` = your Supabase project URL (e.g. https://xyz.supabase.co)
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service_role key (found in Project Settings -> API)
3. Deploy the project. The endpoint will be available at `/api/create-order`.

Alternative: Netlify Functions
- Create a function that proxies `/api/create-order` to the same code or adapt the function to Netlify's format. Set env vars in Netlify UI.

Testing locally
- Use Vercel CLI: `npm i -g vercel` then `vercel dev` (it loads env vars from `.env` if present). Do NOT commit `.env` to git.

Security notes
- **Never** expose the service_role key in frontend code. The server endpoint must be the only place where it is used.
- Consider adding authentication for admin features; use Row Level Security (RLS) with policies if you want to allow limited client inserts.

Database
- Use `supabase/schema.sql` in this repo to create the `products` and `orders` tables and seed example products. Run it in the Supabase SQL editor.

# GOLM Lead-Gen Funnel — Deployment Runbook

First-time deploy, start to finish.

---

## Prerequisites

You need accounts (free tiers are fine for v1) at:

- **Supabase** — [supabase.com](https://supabase.com) (database + service role key)
- **Resend** — [resend.com](https://resend.com) (transactional email)
- **Cloudflare** — [cloudflare.com](https://cloudflare.com) (Turnstile anti-spam widget)
- **Vercel** — [vercel.com](https://vercel.com) (hosting + env management)
- **GitHub** — repo must be pushed and accessible to Vercel

---

## 1. Supabase setup

1. Create a new Supabase project. Note the **Project URL** and both keys
   (anon and service_role) from **Project Settings > API**.

2. Apply the database migration:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   This runs `supabase/migrations/` and creates the `leads` table with all
   required columns, indexes, and RLS enabled.

3. RLS is enabled with **no anon policies**. The anon key (exposed in the
   client bundle) has zero table access. All lead reads and writes go through
   the service role key inside Server Actions only.

4. Verify: open Supabase Table Editor — `leads` table should exist; try an
   anon insert from the SQL editor and confirm it is rejected.

---

## 2. Resend setup

1. Sign in and go to **API Keys > Create API Key**. Copy the key — it is
   shown once.

2. Go to **Domains > Add Domain** and verify your sending domain (add the
   DNS records Resend gives you). Without domain verification, emails land
   in spam or are rejected in production.

3. The from-address used in `lib/resend.ts` must match your verified domain.
   Update it if you change domains.

4. For local testing, Resend's sandbox/test mode works without a verified
   domain. Check `lib/resend.ts` for the dry-run/preview path.

---

## 3. Cloudflare Turnstile setup

1. In the Cloudflare dashboard, go to **Turnstile > Add Widget**.

2. Name it (e.g. `GOLM Lead Funnel`), add your domain(s), choose widget
   type **Managed** (recommended).

3. Copy the **Site Key** (public, goes in `NEXT_PUBLIC_TURNSTILE_SITE_KEY`)
   and the **Secret Key** (server-only, goes in `TURNSTILE_SECRET_KEY`).

4. For local development you can use Cloudflare's always-pass test keys:
   - Site key: `1x00000000000000000000AA`
   - Secret key: `1x0000000000000000000000000000000AA`

---

## 4. Vercel setup

1. Push the repo to GitHub (branch `main` or `master`).

2. In Vercel, click **Add New Project > Import Git Repository** and select
   this repo.

3. Framework preset should auto-detect **Next.js**. Leave build settings as
   detected.

4. Before the first deploy, open **Environment Variables** and add every
   variable from `.env.example` with real values:

   | Variable | Value source |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Project Settings > API > service_role key |
   | `RESEND_API_KEY` | Resend > API Keys |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare > Turnstile > Site Key |
   | `TURNSTILE_SECRET_KEY` | Cloudflare > Turnstile > Secret Key |
   | `BOOKING_URL` | Your booking page URL (see §6 below) |

   Set all variables for **Production**, **Preview**, and **Development**
   environments, or at minimum Production.

5. Click **Deploy**. Vercel builds and publishes to a `*.vercel.app` URL.

---

## 5. Post-deploy verification checklist

Run through this after every fresh deploy before sharing the URL.

- [ ] Landing page (`/`) loads without console errors.
- [ ] "Start the assessment" CTA navigates to `/assessment`.
- [ ] Quiz progresses through all questions without JS errors.
- [ ] Turnstile widget renders and completes on the email/submit step.
- [ ] Submit succeeds — browser redirects to `/results/<token>`.
- [ ] Result page renders the correct score band and CTA.
- [ ] Lead row appears in Supabase Table Editor (`leads`) with correct data:
      email, score, intent band, answers JSONB, token, utm fields.
- [ ] Result email arrives in the submitted inbox within ~30 seconds.
- [ ] If score is Hot band: internal alert email arrives at the GOLM address.
- [ ] Network tab on submit: confirm `SUPABASE_SERVICE_ROLE_KEY`,
      `RESEND_API_KEY`, and `TURNSTILE_SECRET_KEY` are absent from all
      client-side requests (they must never appear in the browser).
- [ ] RLS check: attempt a direct anon `INSERT` into `leads` via the
      Supabase SQL editor using the anon key — it must be rejected.

---

## 6. BOOKING_URL

`BOOKING_URL` is the call-booking link surfaced on the result page for Hot
leads. It must be set to the real booking page (Cal.com, Calendly, or
custom) **before launch**. Using a placeholder URL in production means Hot
leads hit a dead link — the highest-value action in the funnel.

Update it in Vercel **Environment Variables** and redeploy (or trigger a
redeployment) when the real link is ready. No code change needed.

---

## Domain (v1 interim)

The funnel ships on `*.vercel.app` for v1. A custom domain (golm.ca
subpath or dedicated) is pending human decision (Q-04 in
`orchestration/decisions.md`). When the domain is decided, add it in
Vercel > Domains and update Turnstile to include the new domain.

# ApplyTrack — Job Application Management Platform

> **Tagline:** Never lose track of an opportunity.  
> **Target Audience:** Indian college students, freshers, job seekers, and placement candidates.

ApplyTrack is a fast, clean, and mobile-friendly SaaS platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Row Level Security, Storage)**. It streamlines the complete placement journey from tracking applications to managing resume versions, test deadlines, eligibility benchmarks, and technical interview preparation.

---

## Key Features

1. **Job Application Pipeline Tracker**
   - 8 native application stages: *Interested, Applied, Assessment, Interview, Offer, Selected, Rejected, Withdrawn*.
   - Dual views: **Kanban Board** with quick stage transitions and **Searchable Table View**.
   - Multi-factor filtering by company name, role title, and status with date sorting.
   - Rich application metadata: CTC/salary, location, work mode, job URL, recruiter contact, and notes.

2. **Database-Derived Real Analytics**
   - Live metrics derived from actual database records (Total, Applied, Online Assessments, Interviews Scheduled, Offers Received, Deadlines).
   - Visual conversion progress bar showing conversion ratios across rounds.

3. **Upcoming Deadlines & Schedule Calendar**
   - Track online coding tests (HackerRank, Mercer Mettl, etc.), interview slots, and submission deadlines.
   - Highlighting for overdue tasks with one-click completion.
   - Interactive monthly calendar view.

4. **Resume Management Vault**
   - Upload and organize role-specific ATS PDF resumes.
   - Link specific resume versions to individual job applications.
   - Strict file-path isolation via Supabase Storage policies (`auth.uid() = folder`).

5. **Student Skill & Eligibility Benchmark**
   - Student academic profile: Degree, Branch, Graduation Year, College, CGPA, Technical Skills, and Preferences.
   - Interactive eligibility calculator: Manually input company criteria to benchmark CGPA, branch, batch, and skills.

6. **Interview Preparation Hub**
   - Curated core interview questions across 6 disciplines: **Python, SQL, DSA, Machine Learning, HR (STAR Framework), and Aptitude**.
   - Topic progress tracking with personal markdown/notes revision memory.

7. **Multi-Tenant Security & Administration**
   - PostgreSQL Row Level Security (RLS) on all user tables.
   - Restricted admin portal for platform metrics, announcements, and support tickets.

---

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / Database:** Supabase, PostgreSQL, Supabase Auth, Row Level Security (RLS), Supabase Storage
- **Deployment:** Vercel (Frontend), Supabase (Database & Storage)

---

## Local Development Instructions

### 1. Prerequisites
- Node.js `v18.18+` or `v20+` (tested on Node v24)
- npm `v9+` or `v10+`
- Git

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/applytrack.git
cd applytrack
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If Supabase keys are left empty, ApplyTrack automatically runs in offline demo mode using local sandbox storage for zero-setup evaluation).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Tests
```bash
npx tsx scripts/test-runner.ts
```

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## Supabase Project Setup & Database Migration

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project**, select your organization, choose a region (e.g. *South Asia - Mumbai* for lowest latency in India), and set a secure database password.
3. Once provisioned, navigate to **Project Settings -> API** and copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Run Database Migrations
1. In your Supabase dashboard, click **SQL Editor** on the left menu.
2. Open the file [`supabase/migrations/01_initial_schema.sql`](supabase/migrations/01_initial_schema.sql) in this repository.
3. Paste the complete SQL code into the SQL Editor and click **Run**.
4. This creates:
   - `public.profiles`
   - `public.applications`
   - `public.deadlines`
   - `public.resumes`
   - `public.preparation_tasks`
   - `public.activity_logs`
   - `public.admin_announcements`
   - `public.support_tickets`
   - Auto-profile creation trigger upon new user signup
   - Complete Row Level Security (RLS) policies ensuring users only read and write their own data.

### 3. Configure Storage Bucket for Resumes
1. In Supabase, go to **Storage -> Create Bucket**.
2. Name the bucket `resumes`.
3. Set bucket access to **Private** (do NOT check "Public bucket").
4. Under Storage Policies, create policies allowing authenticated users to upload and read objects where the first folder segment equals their `auth.uid()`.

---

## Pushing to GitHub

1. Initialize git and commit your files:
```bash
git init
git add .
git commit -m "feat: complete production-ready ApplyTrack SaaS MVP"
```
2. Create a repository on GitHub (e.g. `applytrack`).
3. Link and push:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/applytrack.git
git push -u origin main
```
*(Note: Your `.env.local` and secret files are protected by `.gitignore` and will never be pushed).*

---

## Deploying to Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New... -> Project** and import your GitHub `applytrack` repository.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL, e.g. `https://applytrack.vercel.app`)
4. Click **Deploy**. Vercel will build and launch your application globally on its high-speed Edge CDN.

### Configuring Custom Domain (e.g. `applytrack.in`)
1. In your Vercel project dashboard, navigate to **Settings -> Domains**.
2. Enter your custom domain (e.g. `applytrack.in`).
3. Add the recommended `CNAME` or `A` records provided by Vercel in your DNS registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Vercel automatically provisions and renews SSL certificates.

---

## Pricing Tiers Architecture

| Tier | Price | Applications | Resumes | Preparation Hub | Eligibility Calculator |
|---|---|---|---|---|---|
| **Free** | ₹0 | Up to 20 | 1 resume | Core previews | Preview |
| **Student Pro** | ₹49/month | Unlimited | Unlimited | Advanced | Advanced |
| **Student Plus** | ₹99/month | Unlimited | Unlimited | Full 6 Modules + Notes | Full Calculator |

*Transparent Billing Disclosure:* Free accounts are instantly accessible. Gateway verification for automated billing is in staging; users can upgrade their subscription tiers in preview mode without payment friction.

---

## License

This project is licensed under the MIT License.

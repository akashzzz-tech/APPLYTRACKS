-- ==============================================================================
-- APPLYTRACK PRODUCTION SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  graduation_year INTEGER,
  cgpa NUMERIC(4, 2),
  skills TEXT[] DEFAULT '{}',
  preferred_roles TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  internship_experience TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'plus')),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT DEFAULT 'application/pdf',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes" 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" 
  ON public.resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" 
  ON public.resumes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" 
  ON public.resumes FOR DELETE 
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes (user_id);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  job_url TEXT,
  location TEXT,
  work_mode TEXT CHECK (work_mode IN ('Remote', 'Hybrid', 'On-site')),
  salary_ctc TEXT,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  application_deadline DATE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (
    status IN ('Interested', 'Applied', 'Assessment', 'Interview', 'Offer', 'Selected', 'Rejected', 'Withdrawn')
  ),
  recruiter_contact TEXT,
  notes TEXT,
  interview_date TIMESTAMPTZ,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  resume_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" 
  ON public.applications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
  ON public.applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
  ON public.applications FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" 
  ON public.applications FOR DELETE 
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON public.applications (user_id, status);
CREATE INDEX IF NOT EXISTS applications_deadline_idx ON public.applications (user_id, application_deadline);

-- 4. DEADLINES & CALENDAR EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'deadline' CHECK (type IN ('deadline', 'assessment', 'interview', 'task')),
  due_date TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deadlines" 
  ON public.deadlines FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deadlines" 
  ON public.deadlines FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deadlines" 
  ON public.deadlines FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deadlines" 
  ON public.deadlines FOR DELETE 
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS deadlines_user_id_idx ON public.deadlines (user_id, due_date);

-- 5. PREPARATION TASKS
CREATE TABLE IF NOT EXISTS public.preparation_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Python', 'SQL', 'DSA', 'Machine Learning', 'HR Questions', 'Aptitude')),
  title TEXT NOT NULL,
  question_or_topic TEXT NOT NULL,
  notes TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.preparation_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preparation tasks" 
  ON public.preparation_tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preparation tasks" 
  ON public.preparation_tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preparation tasks" 
  ON public.preparation_tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preparation tasks" 
  ON public.preparation_tasks FOR DELETE 
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS prep_tasks_user_id_idx ON public.preparation_tasks (user_id, category);

-- 7. PRACTICE NOTES
CREATE TABLE IF NOT EXISTS public.practice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  content TEXT NOT NULL,
  code_snippet TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.practice_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice notes"
  ON public.practice_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice notes"
  ON public.practice_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice notes"
  ON public.practice_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice notes"
  ON public.practice_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS practice_notes_user_id_idx ON public.practice_notes (user_id);
CREATE INDEX IF NOT EXISTS practice_notes_category_idx ON public.practice_notes (user_id, category);
CREATE INDEX IF NOT EXISTS practice_notes_updated_at_idx ON public.practice_notes (user_id, updated_at);

-- 6. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" 
  ON public.activity_logs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs" 
  ON public.activity_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 7. ADMIN ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.admin_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active announcements" 
  ON public.admin_announcements FOR SELECT 
  USING (is_active = true);

-- 8. CONTACT & SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit support tickets" 
  ON public.support_tickets FOR INSERT 
  WITH CHECK (true);

-- 9. AUTO PROFILE CREATION TRIGGER ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. STORAGE BUCKET FOR RESUMES (PRIVATE)
-- Users can only upload and read files from folder matching their auth.uid()
-- Run this in Supabase SQL editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;
-- CREATE POLICY "Users can upload their own resume" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can read their own resume" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete their own resume" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

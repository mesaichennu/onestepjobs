-- ============================================================
-- OneStep Jobs — Complete Supabase SQL Setup  (v2)
-- Run this entire file in: SQL Editor → New Query → Run
-- ============================================================

-- 1. UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. STUDENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name      TEXT         NOT NULL,
  phone          TEXT         NOT NULL,
  email          TEXT         NOT NULL,
  qualification  TEXT         NOT NULL,
  experience     TEXT         NOT NULL,
  skill          TEXT         NOT NULL,
  state          TEXT         NOT NULL,
  district       TEXT         NOT NULL,
  resume_url     TEXT         NOT NULL DEFAULT '',
  status         TEXT         NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','selected','rejected')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Add status column if upgrading from v1
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.students
      ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending','selected','rejected'));
  END IF;
END $$;

-- ============================================================
-- 3. COMPANIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.companies (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name   TEXT         NOT NULL,
  industry       TEXT         NOT NULL,
  contact_person TEXT         NOT NULL,
  email          TEXT         NOT NULL,
  phone          TEXT         NOT NULL,
  location       TEXT         NOT NULL,
  open_roles     TEXT         NOT NULL,
  num_positions  INTEGER      NOT NULL DEFAULT 1 CHECK (num_positions >= 1),
  description    TEXT         NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. STAFF TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.staff (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name      TEXT         NOT NULL,
  phone          TEXT         NOT NULL,
  email          TEXT         NOT NULL,
  role           TEXT         NOT NULL,
  department     TEXT         NOT NULL,
  qualification  TEXT         NOT NULL,
  experience     TEXT         NOT NULL,
  joining_date   TEXT         NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS students_email_idx      ON public.students   (email);
CREATE INDEX IF NOT EXISTS students_created_at_idx ON public.students   (created_at DESC);
CREATE INDEX IF NOT EXISTS students_state_idx      ON public.students   (state);
CREATE INDEX IF NOT EXISTS students_status_idx     ON public.students   (status);
CREATE INDEX IF NOT EXISTS companies_created_at_idx ON public.companies (created_at DESC);
CREATE INDEX IF NOT EXISTS staff_created_at_idx    ON public.staff      (created_at DESC);
CREATE INDEX IF NOT EXISTS staff_department_idx    ON public.staff      (department);

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

-- ── Students ──
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_insert"  ON public.students;
DROP POLICY IF EXISTS "allow_auth_select"    ON public.students;
DROP POLICY IF EXISTS "allow_auth_update"    ON public.students;
DROP POLICY IF EXISTS "allow_auth_delete"    ON public.students;

CREATE POLICY "allow_public_insert"  ON public.students FOR INSERT TO anon          WITH CHECK (true);
CREATE POLICY "allow_auth_select"    ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_update"    ON public.students FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "allow_auth_delete"    ON public.students FOR DELETE TO authenticated USING (true);

-- ── Companies ──
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_auth_all_companies" ON public.companies;
CREATE POLICY "allow_auth_all_companies" ON public.companies
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Staff ──
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_auth_all_staff" ON public.staff;
CREATE POLICY "allow_auth_all_staff" ON public.staff
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 7. STORAGE — resumes bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes','resumes',TRUE,5242880,ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "allow_public_upload_resumes"  ON storage.objects;
DROP POLICY IF EXISTS "allow_auth_read_resumes"      ON storage.objects;
DROP POLICY IF EXISTS "allow_public_select_resumes"  ON storage.objects;

CREATE POLICY "allow_public_upload_resumes"
  ON storage.objects FOR INSERT TO anon        WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "allow_auth_read_resumes"
  ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');
CREATE POLICY "allow_public_select_resumes"
  ON storage.objects FOR SELECT TO anon        USING (bucket_id = 'resumes');

-- ============================================================
-- 8. CREATE ADMIN USERS (do this in the Supabase Dashboard)
-- ============================================================
-- Go to: Authentication → Users → Add User
-- Create THREE users:
--
--   Email: admin@onestepjobs.in      → Student Management panel
--   Email: company@onestepjobs.in   → Company Registration panel
--   Email: staff@onestepjobs.in     → Staff Registration panel
--
-- Set strong passwords for each. These emails determine which
-- dashboard panel the user sees after login.
-- ============================================================

-- DONE ✓

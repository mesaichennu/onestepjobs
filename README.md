# EduConnect — Career Placement Platform

A production-ready React + TypeScript + Supabase web application for student career placement management.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Finding your credentials:**
- Go to [supabase.com](https://supabase.com) → Your Project
- Settings → API
- Copy **Project URL** and **anon public** key

### 3. Run the SQL schema in Supabase

- Open your Supabase project dashboard
- Navigate to **SQL Editor** (left sidebar)
- Click **New Query**
- Copy the entire contents of `supabase_setup.sql`
- Paste into the editor and click **Run**

This will:
- Enable the UUID extension
- Create the `students` table with all required columns
- Add indexes on email, created_at, and state
- Configure Row Level Security (RLS)
- Create the `resumes` storage bucket (PDF-only, 5 MB limit)
- Set up storage access policies

### 4. Create the admin user

- In Supabase dashboard → **Authentication** → **Users**
- Click **Add User**
- Enter your admin email and a strong password
- This account is used to log into `/admin`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
educonnect/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Shared layout wrapper
│   │   ├── Navbar.tsx          # Responsive navigation bar
│   │   └── Footer.tsx          # Site footer
│   ├── pages/
│   │   ├── HomePage.tsx        # Landing page with hero, stats, CTA
│   │   ├── RegisterPage.tsx    # Student registration form
│   │   ├── AboutPage.tsx       # About / mission / team
│   │   ├── ServicesPage.tsx    # Pricing plans
│   │   └── AdminPage.tsx       # Admin login + dashboard
│   ├── routes/
│   │   └── AppRoutes.tsx       # React Router route definitions
│   ├── services/
│   │   └── supabase.ts         # Supabase client + all DB/auth helpers
│   ├── utils/
│   │   └── exportUtils.ts      # PDF (jsPDF) + Excel (xlsx) export
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind + custom design tokens
├── supabase_setup.sql           # Complete SQL to run in Supabase
├── .env.example
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🗺️ Pages & Routes

| Route        | Description                               | Auth Required |
|--------------|-------------------------------------------|---------------|
| `/`          | Home page — hero, features, testimonials  | No            |
| `/register`  | Student registration form + resume upload | No            |
| `/about`     | Company story, mission & vision, team     | No            |
| `/services`  | Pricing plans (Starter / Pro / Enterprise)| No            |
| `/admin`     | Admin login → dashboard (hidden from nav) | Yes           |

---

## 🔒 Security Architecture

### Row Level Security (RLS)

| Role          | INSERT | SELECT | UPDATE | DELETE |
|---------------|--------|--------|--------|--------|
| `anon`        | ✅     | ❌     | ❌     | ❌     |
| `authenticated`| ❌    | ✅     | ❌     | ❌     |

### Storage Policies

- **Upload (INSERT)**: Public — anyone can upload a resume PDF
- **Read (SELECT)**: Authenticated users only (admin dashboard)
- **File types**: PDF only (enforced at bucket level)
- **Max file size**: 5 MB

---

## 📊 Database Schema

```sql
CREATE TABLE public.students (
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
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

---

## 📤 Export Features

### PDF Export
- Landscape A4 format
- Branded header with EduConnect logo bar
- Auto-table with alternating row colors
- Page numbering + footer
- Generated using `jsPDF` + `jspdf-autotable`

### Excel Export
- Formatted column widths
- All student fields including resume URL
- Metadata sheet with report info
- Generated using `xlsx` (SheetJS)

---

## 🎨 Design System

- **Font Display**: Playfair Display (headings)
- **Font Body**: DM Sans (body text)
- **Font Mono**: JetBrains Mono (code/data)
- **Primary Color**: Brand blue (`#0ea5e9`)
- **Accent**: Gold (`#f59e0b`)
- **Theme**: Dark — Slate 950 base

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

---

## ⚠️ Troubleshooting

**"Missing Supabase environment variables"**
→ Make sure `.env` exists (not just `.env.example`) with real values.

**"new row violates row-level security policy"**
→ Ensure the SQL was run completely, especially the INSERT policy for `anon`.

**Resume upload fails**
→ Check that the `resumes` bucket was created. In Supabase → Storage → Buckets.

**Admin login fails**
→ Confirm you created the user via Authentication → Users (not via SQL).

---

## 📄 License

MIT © EduConnect 2024

import { useState, useEffect, useRef } from 'react'
import {
  LogIn, LogOut, Loader2, Shield, ChevronDown,
  Users, Building2, UserCog, BookOpen, AlertCircle
} from 'lucide-react'
import { supabase, adminSignIn, getSession } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'
import StudentDashboard from '../components/StudentDashboard'
import CompanyDashboard from '../components/CompanyDashboard'
import StaffDashboard   from '../components/StaffDashboard'

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CONFIG  — map each panel to a Supabase user email prefix / role label
// The admin creates 3 Supabase Auth users:
//   1. admin@onestepjobs.in         → Student Management
//   2. company@onestepjobs.in       → Company Registration
//   3. staff@onestepjobs.in         → Staff Registration
// The app infers "which panel" from the signed-in user's email.
// ─────────────────────────────────────────────────────────────────────────────

type Section = 'students' | 'company' | 'staff'

interface SectionConfig {
  id:       Section
  label:    string
  icon:     React.ElementType
  color:    string
  accent:   string
  hint:     string
}

const SECTIONS: SectionConfig[] = [
  { id:'students', label:'Student Management',    icon:Users,    color:'text-brand-400',   accent:'bg-brand-600',   hint:'admin@onestepjobs.in' },
  { id:'company',  label:'Company Registration',  icon:Building2,color:'text-orange-400',  accent:'bg-orange-600',  hint:'company@onestepjobs.in' },
  { id:'staff',    label:'Staff Registration',    icon:UserCog,  color:'text-emerald-400', accent:'bg-emerald-700', hint:'staff@onestepjobs.in' },
]

function sectionFromEmail(email: string): Section {
  const e = email.toLowerCase()
  if (e.startsWith('company')) return 'company'
  if (e.startsWith('staff'))   return 'staff'
  return 'students'
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PANEL
// ─────────────────────────────────────────────────────────────────────────────

function LoginPanel({
  section, onSuccess,
}: { section: SectionConfig; onSuccess: (session: Session) => void }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const Icon = section.icon

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Both fields are required.'); return }
    setLoading(true); setError('')
    const { data, error: err } = await adminSignIn(email, password)
    if (err) { setError(err.message || 'Invalid credentials.'); setLoading(false) }
    else if (data.session) onSuccess(data.session)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-600/8 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl px-5 py-3 shadow-xl mb-5">
            <img src="/logo.jpeg" alt="OneStep Jobs" className="h-12 w-auto object-contain" style={{mixBlendMode:'multiply'}} />
          </div>
          <p className="text-slate-500 text-sm">Admin Portal</p>
        </div>

        <div className="card border-slate-700/60">
          {/* Panel indicator */}
          <div className={`flex items-center gap-3 mb-6 pb-5 border-b border-slate-800`}>
            <div className={`w-10 h-10 ${section.accent} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{section.label}</div>
              <div className="text-slate-500 text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" /> Secure access required
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={section.hint} className="input-field" autoComplete="username" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="input-field" autoComplete="current-password" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              {loading ? 'Signing in…' : `Sign In to ${section.label}`}
            </button>
          </form>
          <p className="text-center text-slate-600 text-xs mt-5">Restricted to authorised personnel only.</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION SELECTOR DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

function SectionDropdown({
  current, onChange,
}: { current: SectionConfig; onChange: (s: SectionConfig) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const Icon = current.icon

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-2.5 transition-all">
        <Icon className={`w-4 h-4 ${current.color}`} />
        <span className="text-white font-medium text-sm">{current.label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[230px]">
          {SECTIONS.map(s => {
            const SIcon = s.icon
            return (
              <button key={s.id} onClick={() => { onChange(s); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-slate-700 transition-colors text-left ${current.id === s.id ? 'bg-slate-700/60' : ''}`}>
                <div className={`w-8 h-8 ${s.accent} rounded-lg flex items-center justify-center shrink-0`}>
                  <SIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{s.label}</div>
                  <div className="text-slate-500 text-xs">{s.hint}</div>
                </div>
                {current.id === s.id && <span className="ml-auto w-2 h-2 bg-brand-400 rounded-full" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────

function DashboardShell({
  session, activeSectionId, onSectionChange, onLogout,
}: {
  session: Session
  activeSectionId: Section
  onSectionChange: (s: SectionConfig) => void
  onLogout: () => void
}) {
  const activeSection = SECTIONS.find(s => s.id === activeSectionId) ?? SECTIONS[0]
  const Icon = activeSection.icon

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: logo + dropdown */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-md shrink-0">
              <img src="/logo.jpeg" alt="OneStep Jobs" className="h-7 w-auto object-contain" style={{mixBlendMode:'multiply'}} />
            </div>
            <span className="hidden sm:block text-slate-600 font-mono text-xs">Admin</span>
            <SectionDropdown current={activeSection} onChange={onSectionChange} />
          </div>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className={`w-8 h-8 ${activeSection.accent} rounded-full flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">{session.user.email}</span>
            </div>
            <button onClick={onLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-slate-800">
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page heading */}
      <div className="max-w-full px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 ${activeSection.accent} rounded-xl flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-2xl">{activeSection.label}</h1>
            <p className="text-slate-500 text-sm">Manage and export {activeSection.label.toLowerCase()} records</p>
          </div>
        </div>

        {/* Dashboard content */}
        {activeSectionId === 'students' && <StudentDashboard />}
        {activeSectionId === 'company'  && <CompanyDashboard />}
        {activeSectionId === 'staff'    && <StaffDashboard />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — orchestrates auth + section switching
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession]             = useState<Session | null>(null)
  const [checking, setChecking]           = useState(true)
  const [pendingSection, setPendingSection] = useState<SectionConfig>(SECTIONS[0])
  const [activeSection, setActiveSection] = useState<Section>('students')

  // On mount, restore any existing session
  useEffect(() => {
    getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session)
        setActiveSection(sectionFromEmail(data.session.user.email ?? ''))
      }
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) setActiveSection(sectionFromEmail(s.user.email ?? ''))
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  // When user picks a different section from the dropdown:
  // If already logged in as correct role → switch view
  // Otherwise → sign out and show that section's login
  async function handleSectionChange(s: SectionConfig) {
    if (session) {
      const currentRole = sectionFromEmail(session.user.email ?? '')
      if (currentRole === s.id) {
        setActiveSection(s.id)
        return
      }
      // Different role → sign out and prompt new login
      await supabase.auth.signOut()
      setSession(null)
    }
    setPendingSection(s)
  }

  function handleLoginSuccess(newSession: Session) {
    setSession(newSession)
    const role = sectionFromEmail(newSession.user.email ?? '')
    setActiveSection(role)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    )
  }

  // Not logged in → show login for pending section
  if (!session) {
    return <LoginPanel section={pendingSection} onSuccess={handleLoginSuccess} />
  }

  // Logged in → show dashboard
  return (
    <DashboardShell
      session={session}
      activeSectionId={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
    />
  )
}

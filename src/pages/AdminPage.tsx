import { useState, useEffect, useRef } from 'react'
import {
  LogIn, LogOut, Loader2, Shield, ChevronDown,
  Users, Building2, UserCog, AlertCircle, Crown
} from 'lucide-react'
import { supabase, adminSignIn, getSession } from '../services/supabase'
import type { Session } from '@supabase/supabase-js'
import StudentDashboard    from '../components/StudentDashboard'
import CompanyDashboard    from '../components/CompanyDashboard'
import StaffDashboard      from '../components/StaffDashboard'
import SuperAdminDashboard from '../components/SuperAdminDashboard'

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CONFIG
// Email prefix rules:
//   superadmin@... → Super Admin (all panels + add/edit)
//   company@...    → Company panel (read-only)
//   staff@...      → Staff panel (read-only)
//   anything else  → Student Management
// ─────────────────────────────────────────────────────────────────────────────

type Section = 'superadmin' | 'students' | 'company' | 'staff'

interface SectionConfig {
  id:     Section
  label:  string
  icon:   React.ElementType
  color:  string
  accent: string
  hint:   string
  badge?: string
}

const SECTIONS: SectionConfig[] = [
  { id:'superadmin', label:'Super Admin',          icon:Crown,    color:'text-purple-400',  accent:'bg-purple-700',  hint:'superadmin@onestepjobs.in', badge:'Full Access' },
  { id:'students',   label:'Student Management',   icon:Users,    color:'text-brand-400',   accent:'bg-brand-600',   hint:'admin@onestepjobs.in' },
  { id:'company',    label:'Company Registration', icon:Building2,color:'text-orange-400',  accent:'bg-orange-600',  hint:'company@onestepjobs.in' },
  { id:'staff',      label:'Staff Registration',   icon:UserCog,  color:'text-emerald-400', accent:'bg-emerald-700', hint:'staff@onestepjobs.in' },
]

function sectionFromEmail(email: string): Section {
  const e = email.toLowerCase()
  if (e.startsWith('superadmin')) return 'superadmin'
  if (e.startsWith('company'))    return 'company'
  if (e.startsWith('staff'))      return 'staff'
  return 'students'
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PANEL
// ─────────────────────────────────────────────────────────────────────────────

function LoginPanel({ section, onSuccess }: {
  section: SectionConfig
  onSuccess: (session: Session) => void
}) {
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

  const isSuperAdmin = section.id === 'superadmin'

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${isSuperAdmin ? 'bg-purple-600/10' : 'bg-brand-600/10'}`} />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-600/8 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-2xl px-5 py-3 shadow-xl mb-5">
            <img src="/logo.jpeg" alt="OneStep Jobs" className="h-12 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <p className="text-slate-500 text-sm">Admin Portal</p>
        </div>

        {/* Super admin special banner */}
        {isSuperAdmin && (
          <div className="mb-4 flex items-center gap-3 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3">
            <Crown className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <p className="text-purple-300 font-semibold text-sm">Super Admin Access</p>
              <p className="text-slate-500 text-xs">Full access to all dashboards, add & edit records</p>
            </div>
          </div>
        )}

        <div className="card border-slate-700/60">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-800">
            <div className={`w-10 h-10 ${section.accent} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">{section.label}</div>
              <div className="text-slate-500 text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" /> Secure access required
              </div>
            </div>
            {section.badge && (
              <span className="ml-auto bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-500/30">
                {section.badge}
              </span>
            )}
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
              className={`w-full justify-center mt-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2 px-6 font-semibold rounded-xl transition-all ${
                isSuperAdmin
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25'
                  : 'btn-primary'
              }`}
            >
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

function SectionDropdown({ current, onChange }: {
  current: SectionConfig
  onChange: (s: SectionConfig) => void
}) {
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
        {current.badge && (
          <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full">
            {current.badge}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden min-w-[260px]">
          {SECTIONS.map(s => {
            const SIcon = s.icon
            return (
              <button key={s.id} onClick={() => { onChange(s); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-slate-700 transition-colors text-left ${current.id === s.id ? 'bg-slate-700/60' : ''}`}>
                <div className={`w-8 h-8 ${s.accent} rounded-lg flex items-center justify-center shrink-0`}>
                  <SIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium flex items-center gap-2">
                    {s.label}
                    {s.badge && (
                      <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-1.5 py-0.5 rounded">
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-xs">{s.hint}</div>
                </div>
                {current.id === s.id && <span className="w-2 h-2 bg-brand-400 rounded-full" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────

function DashboardShell({ session, activeSectionId, onSectionChange, onLogout }: {
  session: Session
  activeSectionId: Section
  onSectionChange: (s: SectionConfig) => void
  onLogout: () => void
}) {
  const activeSection = SECTIONS.find(s => s.id === activeSectionId) ?? SECTIONS[0]
  const Icon = activeSection.icon
  const isSuperAdmin = activeSectionId === 'superadmin'

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className={`border-b border-slate-800 sticky top-0 z-40 ${isSuperAdmin ? 'bg-gradient-to-r from-purple-950/80 to-slate-900/90 backdrop-blur-md' : 'bg-slate-900'}`}>
        <div className="max-w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-md shrink-0">
              <img src="/logo.jpeg" alt="OneStep Jobs" className="h-7 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
            </div>
            <span className="hidden sm:block text-slate-600 font-mono text-xs">Admin</span>
            <SectionDropdown current={activeSection} onChange={onSectionChange} />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {isSuperAdmin && <Crown className="w-4 h-4 text-purple-400" />}
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
          <div className={`w-10 h-10 ${activeSection.accent} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-2xl flex items-center gap-2">
              {activeSection.label}
              {activeSection.badge && (
                <span className="bg-purple-500/20 text-purple-300 text-sm font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {activeSection.badge}
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm">
              {isSuperAdmin ? 'Full access — all dashboards, add/edit companies & staff' : `Manage and export ${activeSection.label.toLowerCase()} records`}
            </p>
          </div>
        </div>

        {activeSectionId === 'superadmin' && <SuperAdminDashboard />}
        {activeSectionId === 'students'   && <StudentDashboard />}
        {activeSectionId === 'company'    && <CompanyDashboard />}
        {activeSectionId === 'staff'      && <StaffDashboard />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [session, setSession]               = useState<Session | null>(null)
  const [checking, setChecking]             = useState(true)
  const [pendingSection, setPendingSection] = useState<SectionConfig>(SECTIONS[0])
  const [activeSection, setActiveSection]   = useState<Section>('superadmin')

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

  async function handleSectionChange(s: SectionConfig) {
    if (session) {
      const currentRole = sectionFromEmail(session.user.email ?? '')
      if (currentRole === s.id) { setActiveSection(s.id); return }
      await supabase.auth.signOut()
      setSession(null)
    }
    setPendingSection(s)
  }

  function handleLoginSuccess(newSession: Session) {
    setSession(newSession)
    setActiveSection(sectionFromEmail(newSession.user.email ?? ''))
  }

  if (checking) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
    </div>
  )

  if (!session) return <LoginPanel section={pendingSection} onSuccess={handleLoginSuccess} />

  return (
    <DashboardShell
      session={session}
      activeSectionId={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={handleLogout}
    />
  )
}

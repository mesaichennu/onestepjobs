import { useState, useEffect, useCallback } from 'react'
import {
  Users, Building2, UserCog, LayoutDashboard, Plus, Save, X,
  AlertCircle, Loader2, TrendingUp, CheckCircle, Clock, XCircle,
  ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react'
import {
  fetchStudents, fetchCompanies, fetchStaff,
  insertCompany, updateCompany, deleteCompany,
  insertStaff, updateStaff, deleteStaff,
  type Student, type Company, type Staff,
  type CompanyInsert, type StaffInsert,
} from '../services/supabase'
import StudentDashboard from './StudentDashboard'
import CompanyDashboard from './CompanyDashboard'
import StaffDashboard   from './StaffDashboard'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Information Technology', 'Finance & Banking', 'Healthcare', 'Manufacturing',
  'Education', 'Retail & E-Commerce', 'Media & Advertising', 'Real Estate',
  'Logistics & Supply Chain', 'Hospitality & Tourism', 'Other',
]
const DEPARTMENTS = [
  'Engineering', 'Sales', 'Marketing', 'Human Resources', 'Operations',
  'Finance', 'Customer Support', 'Product', 'Design', 'Administration', 'Other',
]
const ROLES = [
  'Manager', 'Senior Engineer', 'Junior Engineer', 'Analyst', 'Executive',
  'Coordinator', 'Specialist', 'Consultant', 'Intern', 'Director', 'Other',
]
const EXPERIENCE_OPTIONS = [
  'Fresher (0 years)', '0–1 Year', '1–2 Years', '2–3 Years',
  '3–5 Years', '5–7 Years', '7–10 Years', '10+ Years',
]
const QUALIFICATIONS = [
  'High School (10th)', 'Higher Secondary (12th)', 'Diploma',
  "Bachelor's Degree", "Master's Degree", "Ph.D / Doctorate", 'Other',
]

const BLANK_COMPANY: CompanyInsert = {
  company_name: '', industry: '', contact_person: '', email: '',
  phone: '', location: '', open_roles: '', num_positions: 1, description: '',
}
const BLANK_STAFF: StaffInsert = {
  full_name: '', phone: '', email: '', role: '', department: '',
  qualification: '', experience: '', joining_date: '',
}

type Tab = 'overview' | 'students' | 'companies' | 'staff'

// ─────────────────────────────────────────────────────────────────────────────
// SHARED FIELD WRAPPER  (module-level — avoids focus-loss bug)
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, name, error, children }: {
  label: string; name: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY FORM  (module-level)
// ─────────────────────────────────────────────────────────────────────────────

function CompanyForm({ initial, onSave, onCancel, saving }: {
  initial: CompanyInsert
  onSave: (d: CompanyInsert) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm]     = useState<CompanyInsert>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setForm(initial); setErrors({}) }, [initial])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.company_name.trim())   e.company_name   = 'Required'
    if (!form.industry)              e.industry        = 'Required'
    if (!form.contact_person.trim()) e.contact_person  = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit number'
    if (!form.location.trim())       e.location        = 'Required'
    if (!form.open_roles.trim())     e.open_roles      = 'Required'
    if (form.num_positions < 1)      e.num_positions   = 'Must be ≥ 1'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function ch(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: name === 'num_positions' ? Number(value) : value }))
    setErrors(p => { const n = { ...p }; delete n[name]; return n })
  }

  return (
    <div className="card border-orange-500/30 mb-2">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5 text-orange-400" />
          {form.company_name ? `Edit: ${form.company_name}` : 'Add New Company'}
        </h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Field label="Company Name *" name="company_name" error={errors.company_name}>
          <input id="company_name" name="company_name" value={form.company_name} onChange={ch}
            placeholder="Acme Corp" className={`input-field ${errors.company_name ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Industry *" name="industry" error={errors.industry}>
          <input list="industry-list" id="industry" name="industry" value={form.industry} onChange={ch}
            placeholder="Select industry" className={`input-field ${errors.industry ? 'border-red-500/60' : ''}`} />

        </Field>
        <Field label="Contact Person *" name="contact_person" error={errors.contact_person}>
          <input id="contact_person" name="contact_person" value={form.contact_person} onChange={ch}
            placeholder="Rahul Sharma" className={`input-field ${errors.contact_person ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Email *" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={form.email} onChange={ch}
            placeholder="hr@company.com" className={`input-field ${errors.email ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Phone *" name="phone" error={errors.phone}>
          <input id="phone" name="phone" value={form.phone} onChange={ch} maxLength={10}
            placeholder="9876543210" className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Location *" name="location" error={errors.location}>
          <input id="location" name="location" value={form.location} onChange={ch}
            placeholder="Hyderabad, Telangana" className={`input-field ${errors.location ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Open Roles *" name="open_roles" error={errors.open_roles}>
          <input id="open_roles" name="open_roles" value={form.open_roles} onChange={ch}
            placeholder="Software Engineer, QA" className={`input-field ${errors.open_roles ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="No. of Positions *" name="num_positions" error={errors.num_positions}>
          <input id="num_positions" name="num_positions" type="number" min={1}
            value={form.num_positions} onChange={ch}
            className={`input-field ${errors.num_positions ? 'border-red-500/60' : ''}`} />
        </Field>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={ch}
            rows={3} placeholder="Brief about the company…"
            className="input-field resize-none" />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary py-2.5 px-5">Cancel</button>
        <button type="button" onClick={() => { if (validate()) onSave(form) }} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Company'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF FORM  (module-level)
// ─────────────────────────────────────────────────────────────────────────────

function StaffForm({ initial, onSave, onCancel, saving }: {
  initial: StaffInsert
  onSave: (d: StaffInsert) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm]     = useState<StaffInsert>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setForm(initial); setErrors({}) }, [initial])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.full_name.trim() || form.full_name.trim().length < 3) e.full_name    = 'Min 3 characters'
    if (!/^[6-9]\d{9}$/.test(form.phone))                           e.phone        = 'Valid 10-digit number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))             e.email        = 'Valid email required'
    if (!form.role)                                                  e.role         = 'Required'
    if (!form.department)                                            e.department   = 'Required'
    if (!form.qualification)                                         e.qualification= 'Required'
    if (!form.experience)                                            e.experience   = 'Required'
    if (!form.joining_date)                                          e.joining_date = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function ch(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => { const n = { ...p }; delete n[name]; return n })
  }

  return (
    <div className="card border-emerald-500/30 mb-2">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
        <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
          <UserCog className="w-5 h-5 text-emerald-400" />
          {form.full_name ? `Edit: ${form.full_name}` : 'Add New Staff Member'}
        </h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <Field label="Full Name *" name="full_name" error={errors.full_name}>
          <input id="full_name" name="full_name" value={form.full_name} onChange={ch}
            placeholder="Priya Sharma" className={`input-field ${errors.full_name ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Phone *" name="phone" error={errors.phone}>
          <input id="phone" name="phone" value={form.phone} onChange={ch} maxLength={10}
            placeholder="9876543210" className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Email *" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={form.email} onChange={ch}
            placeholder="priya@company.com" className={`input-field ${errors.email ? 'border-red-500/60' : ''}`} />
        </Field>
        <Field label="Role *" name="role" error={errors.role}>
          <select id="role" name="role" value={form.role} onChange={ch}
            className={`input-field bg-slate-800 ${errors.role ? 'border-red-500/60' : ''}`}>
            <option value="">Select role</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Department *" name="department" error={errors.department}>
          <input list="department-list" id="department" name="department" value={form.department} onChange={ch}
            placeholder="Select department" className={`input-field ${errors.department ? 'border-red-500/60' : ''}`} />

        </Field>
        <Field label="Qualification *" name="qualification" error={errors.qualification}>
          <select id="qualification" name="qualification" value={form.qualification} onChange={ch}
            className={`input-field bg-slate-800 ${errors.qualification ? 'border-red-500/60' : ''}`}>
            <option value="">Select qualification</option>
            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </Field>
        <Field label="Experience *" name="experience" error={errors.experience}>
          <select id="experience" name="experience" value={form.experience} onChange={ch}
            className={`input-field bg-slate-800 ${errors.experience ? 'border-red-500/60' : ''}`}>
            <option value="">Select experience</option>
            {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </Field>
        <Field label="Joining Date *" name="joining_date" error={errors.joining_date}>
          <input id="joining_date" name="joining_date" type="date"
            value={form.joining_date} onChange={ch}
            className={`input-field ${errors.joining_date ? 'border-red-500/60' : ''}`} />
        </Field>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary py-2.5 px-5">Cancel</button>
        <button type="button" onClick={() => { if (validate()) onSave(form) }} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Staff'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW STATS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function OverviewPanel() {
  const [stats, setStats] = useState({
    students: 0, pending: 0, selected: 0, rejected: 0,
    companies: 0, totalPositions: 0, staff: 0, departments: 0,
  })
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [s, c, st] = await Promise.all([fetchStudents(), fetchCompanies(), fetchStaff()])
    const students = (s.data ?? []) as Student[]
    const companies = (c.data ?? []) as Company[]
    const staffList = (st.data ?? []) as Staff[]
    setStats({
      students:       students.length,
      pending:        students.filter(x => (x.status ?? 'pending') === 'pending').length,
      selected:       students.filter(x => x.status === 'selected').length,
      rejected:       students.filter(x => x.status === 'rejected').length,
      companies:      companies.length,
      totalPositions: companies.reduce((a, x) => a + x.num_positions, 0),
      staff:          staffList.length,
      departments:    [...new Set(staffList.map(x => x.department))].length,
    })
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400" /> Loading overview…
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Top summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',    value: stats.students,       icon: Users,       color: 'text-brand-400',   bg: 'bg-brand-500/10' },
          { label: 'Total Companies',   value: stats.companies,      icon: Building2,   color: 'text-orange-400',  bg: 'bg-orange-500/10' },
          { label: 'Open Positions',    value: stats.totalPositions, icon: TrendingUp,  color: 'text-gold-400',    bg: 'bg-gold-500/10' },
          { label: 'Staff Members',     value: stats.staff,          icon: UserCog,     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map(s => (
          <div key={s.label} className="card group hover:border-slate-700 transition-all">
            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className={`font-display text-4xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Student status breakdown */}
      <div className="card">
        <h3 className="font-display font-semibold text-white text-lg mb-5 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" /> Student Status Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Pending',  value: stats.pending,  icon: Clock,       color: 'text-yellow-400',  bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Selected', value: stats.selected, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle,     color: 'text-red-400',     bg: 'bg-red-500/10',    border: 'border-red-500/20' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-4 rounded-xl p-4 border ${s.bg} ${s.border}`}>
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <div className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
              {stats.students > 0 && (
                <div className="ml-auto text-right">
                  <div className="text-white font-semibold text-sm">
                    {Math.round((s.value / stats.students) * 100)}%
                  </div>
                  <div className="text-slate-600 text-xs">of total</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {stats.students > 0 && (
          <div className="mt-5">
            <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
              <div className="bg-yellow-400 transition-all" style={{ width: `${(stats.pending / stats.students) * 100}%` }} />
              <div className="bg-emerald-400 transition-all" style={{ width: `${(stats.selected / stats.students) * 100}%` }} />
              <div className="bg-red-400 transition-all"     style={{ width: `${(stats.rejected / stats.students) * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1.5">
              <span>Pending {stats.pending}</span>
              <span>Selected {stats.selected}</span>
              <span>Rejected {stats.rejected}</span>
            </div>
          </div>
        )}
      </div>

      {/* Company & Staff mini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card border-orange-500/20">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-orange-400" /> Companies
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-display text-4xl font-bold text-orange-400">{stats.companies}</div>
              <div className="text-slate-400 text-sm">Registered companies</div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-white">{stats.totalPositions}</div>
              <div className="text-slate-500 text-xs">Total open positions</div>
            </div>
          </div>
        </div>
        <div className="card border-emerald-500/20">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
            <UserCog className="w-4 h-4 text-emerald-400" /> Staff
          </h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-display text-4xl font-bold text-emerald-400">{stats.staff}</div>
              <div className="text-slate-400 text-sm">Staff members</div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold text-white">{stats.departments}</div>
              <div className="text-slate-500 text-xs">Departments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <button onClick={load}
          className="btn-secondary py-2.5 px-5 text-sm gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Overview
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANIES WITH FORMS  (super admin only)
// ─────────────────────────────────────────────────────────────────────────────

function CompaniesWithForms() {
  const [showForm, setShowForm]       = useState(false)
  const [editTarget, setEditTarget]   = useState<Company | null>(null)
  const [saving, setSaving]           = useState(false)
  const [refreshKey, setRefreshKey]   = useState(0)
  const [successMsg, setSuccessMsg]   = useState('')

  const formInitial: CompanyInsert = editTarget
    ? { company_name: editTarget.company_name, industry: editTarget.industry, contact_person: editTarget.contact_person, email: editTarget.email, phone: editTarget.phone, location: editTarget.location, open_roles: editTarget.open_roles, num_positions: editTarget.num_positions, description: editTarget.description }
    : BLANK_COMPANY

  async function handleSave(form: CompanyInsert) {
    setSaving(true)
    if (editTarget) {
      await updateCompany(editTarget.id, form)
    } else {
      await insertCompany(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditTarget(null)
    setRefreshKey(k => k + 1)
    setSuccessMsg(editTarget ? 'Company updated successfully!' : 'Company added successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Company Management</h2>
          <p className="text-slate-500 text-sm">Add and manage company registrations</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25"
        >
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {(showForm || editTarget !== null) && (
        <CompanyForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
          saving={saving}
        />
      )}

      {/* Read-only table — re-mounts on refreshKey change to reload data */}
      <CompanyDashboard key={refreshKey} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF WITH FORMS  (super admin only)
// ─────────────────────────────────────────────────────────────────────────────

function StaffWithForms() {
  const [showForm, setShowForm]     = useState(false)
  const [editTarget, setEditTarget] = useState<Staff | null>(null)
  const [saving, setSaving]         = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [successMsg, setSuccessMsg] = useState('')

  const formInitial: StaffInsert = editTarget
    ? { full_name: editTarget.full_name, phone: editTarget.phone, email: editTarget.email, role: editTarget.role, department: editTarget.department, qualification: editTarget.qualification, experience: editTarget.experience, joining_date: editTarget.joining_date }
    : BLANK_STAFF

  async function handleSave(form: StaffInsert) {
    setSaving(true)
    if (editTarget) {
      await updateStaff(editTarget.id, form)
    } else {
      await insertStaff(form)
    }
    setSaving(false)
    setShowForm(false)
    setEditTarget(null)
    setRefreshKey(k => k + 1)
    setSuccessMsg(editTarget ? 'Staff member updated!' : 'Staff member added successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Staff Management</h2>
          <p className="text-slate-500 text-sm">Add and manage staff registrations</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {(showForm || editTarget !== null) && (
        <StaffForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
          saving={saving}
        />
      )}

      <StaffDashboard key={refreshKey} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SUPER ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType; color: string; accent: string }[] = [
  { id: 'overview',   label: 'Overview',    icon: LayoutDashboard, color: 'text-purple-400',  accent: 'bg-purple-600' },
  { id: 'students',   label: 'Students',    icon: Users,           color: 'text-brand-400',   accent: 'bg-brand-600' },
  { id: 'companies',  label: 'Companies',   icon: Building2,       color: 'text-orange-400',  accent: 'bg-orange-500' },
  { id: 'staff',      label: 'Staff',       icon: UserCog,         color: 'text-emerald-400', accent: 'bg-emerald-600' },
]

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const activeConfig = TABS.find(t => t.id === activeTab) ?? TABS[0]
  const Icon = activeConfig.icon

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        {TABS.map(tab => {
          const TIcon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? `${tab.accent} text-white shadow-lg`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TIcon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab heading */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <div className={`w-9 h-9 ${activeConfig.accent} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-xl">{activeConfig.label}</h2>
          <p className="text-slate-500 text-xs">
            {activeTab === 'overview'  && 'Platform-wide statistics and health'}
            {activeTab === 'students'  && 'View, filter, and manage all student registrations'}
            {activeTab === 'companies' && 'Add and manage company registrations'}
            {activeTab === 'staff'     && 'Add and manage staff members'}
          </p>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview'  && <OverviewPanel />}
      {activeTab === 'students'  && <StudentDashboard />}
      {activeTab === 'companies' && <CompaniesWithForms />}
      {activeTab === 'staff'     && <StaffWithForms />}
    </div>
  )
}

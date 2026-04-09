import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Search, RefreshCw, FileSpreadsheet, FileText,
  UserCog, AlertCircle, Loader2, Pencil, Trash2, X, Save,
  ChevronUp, ChevronDown, MessageCircle
} from 'lucide-react'
import {
  insertStaff, fetchStaff, updateStaff, deleteStaff,
  type Staff, type StaffInsert,
} from '../services/supabase'
import { exportStaffToPDF, exportStaffToExcel } from '../utils/exportUtils'

// ── Constants ─────────────────────────────────────────────────────────────

const BLANK: StaffInsert = {
  full_name: '', phone: '', email: '', role: '',
  department: '', qualification: '', experience: '', joining_date: '',
}

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

// ── Field wrapper — MODULE LEVEL (never re-created on parent render) ──────

function Field({
  label, name, error, children,
}: {
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

// ── Confirm delete — MODULE LEVEL ─────────────────────────────────────────

function ConfirmDelete({
  name, onConfirm, onCancel,
}: {
  name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-display font-bold text-white text-lg text-center mb-2">Delete Staff</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          Delete <span className="text-white font-semibold">{name}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary py-2.5 justify-center">Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Staff Form — MODULE LEVEL ─────────────────────────────────────────────

function StaffForm({
  initial, onSave, onCancel, saving,
}: {
  initial: StaffInsert
  onSave: (d: StaffInsert) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm]     = useState<StaffInsert>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync when switching add↔edit
  useEffect(() => { setForm(initial); setErrors({}) }, [initial])

  function validate(): boolean {
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  return (
    <div className="card border-emerald-500/30 mb-6">
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
          <input
            id="full_name" name="full_name"
            value={form.full_name} onChange={handleChange}
            placeholder="Priya Sharma"
            className={`input-field ${errors.full_name ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Phone *" name="phone" error={errors.phone}>
          <input
            id="phone" name="phone"
            value={form.phone} onChange={handleChange}
            maxLength={10} placeholder="9876543210"
            className={`input-field ${errors.phone ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Email *" name="email" error={errors.email}>
          <input
            id="email" name="email" type="email"
            value={form.email} onChange={handleChange}
            placeholder="priya@company.com"
            className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Role *" name="role" error={errors.role}>
          <select
            id="role" name="role"
            value={form.role} onChange={handleChange}
            className={`input-field bg-slate-800 ${errors.role ? 'border-red-500/60' : ''}`}
          >
            <option value="">Select role</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>

        <Field label="Department *" name="department" error={errors.department}>
          <select
            id="department" name="department"
            value={form.department} onChange={handleChange}
            className={`input-field bg-slate-800 ${errors.department ? 'border-red-500/60' : ''}`}
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Qualification *" name="qualification" error={errors.qualification}>
          <select
            id="qualification" name="qualification"
            value={form.qualification} onChange={handleChange}
            className={`input-field bg-slate-800 ${errors.qualification ? 'border-red-500/60' : ''}`}
          >
            <option value="">Select qualification</option>
            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
        </Field>

        <Field label="Experience *" name="experience" error={errors.experience}>
          <select
            id="experience" name="experience"
            value={form.experience} onChange={handleChange}
            className={`input-field bg-slate-800 ${errors.experience ? 'border-red-500/60' : ''}`}
          >
            <option value="">Select experience</option>
            {EXPERIENCE_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </Field>

        <Field label="Joining Date *" name="joining_date" error={errors.joining_date}>
          <input
            id="joining_date" name="joining_date" type="date"
            value={form.joining_date} onChange={handleChange}
            className={`input-field ${errors.joining_date ? 'border-red-500/60' : ''}`}
          />
        </Field>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary py-2.5 px-5">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { if (validate()) onSave(form) }}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Staff'}
        </button>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────

type SortKey = keyof Staff

export default function StaffDashboard() {
  const [staff, setStaff]               = useState<Staff[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [editTarget, setEditTarget]     = useState<Staff | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null)
  const [saving, setSaving]             = useState(false)
  const [sortKey, setSortKey]           = useState<SortKey>('created_at')
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const { data, error: err } = await fetchStaff()
    if (err) setError(err.message)
    else setStaff((data ?? []) as Staff[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(form: StaffInsert) {
    setSaving(true)
    if (editTarget) {
      const { data, error: err } = await updateStaff(editTarget.id, form)
      if (!err && data) setStaff(prev => prev.map(s => s.id === editTarget.id ? data as Staff : s))
    } else {
      const { data, error: err } = await insertStaff(form)
      if (!err && data) setStaff(prev => [data as Staff, ...prev])
    }
    setSaving(false); setShowForm(false); setEditTarget(null)
  }

  async function handleDelete(s: Staff) {
    await deleteStaff(s.id)
    setStaff(prev => prev.filter(x => x.id !== s.id))
    setDeleteTarget(null)
  }

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  const filtered = staff
    .filter(s => {
      const q = search.toLowerCase()
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  function TH({ label, col }: { label: string; col: SortKey }) {
    return (
      <th
        onClick={() => toggleSort(col)}
        className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap"
      >
        <span className="flex items-center gap-1">
          {label}
          {sortKey === col
            ? sortDir === 'asc'
              ? <ChevronUp className="w-3 h-3 text-emerald-400" />
              : <ChevronDown className="w-3 h-3 text-emerald-400" />
            : <ChevronUp className="w-3 h-3 text-slate-600" />}
        </span>
      </th>
    )
  }

  const formInitial: StaffInsert = editTarget
    ? {
        full_name:     editTarget.full_name,
        phone:         editTarget.phone,
        email:         editTarget.email,
        role:          editTarget.role,
        department:    editTarget.department,
        qualification: editTarget.qualification,
        experience:    editTarget.experience,
        joining_date:  editTarget.joining_date,
      }
    : BLANK

  const deptMap: Record<string, number> = {}
  staff.forEach(s => { deptMap[s.department] = (deptMap[s.department] || 0) + 1 })
  const topDept = Object.entries(deptMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Staff',   value: staff.length },
          { label: 'Departments',   value: [...new Set(staff.map(s => s.department))].length },
          { label: 'Top Department', value: topDept },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3">
              <UserCog className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="font-display text-2xl font-bold text-white mb-1 truncate">{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, role, department…"
              className="input-field pl-10"
            />
          </div>
          <button onClick={load} className="btn-secondary py-3 px-4" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => exportStaffToExcel(filtered)}
            className="btn-secondary py-3 px-4 hover:border-emerald-500/50 hover:text-emerald-400 whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => exportStaffToPDF(filtered)}
            className="btn-secondary py-3 px-4 hover:border-red-500/50 hover:text-red-400 whitespace-nowrap">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Form */}
      {(showForm || editTarget !== null) && (
        <StaffForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
          saving={saving}
        />
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <UserCog className="w-4 h-4 text-emerald-400" />
            Staff Members
            <span className="bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-400" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <UserCog className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search ? 'No staff match.' : 'No staff registered yet. Add one above.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
                  <TH label="Name"         col="full_name" />
                  <TH label="Phone"        col="phone" />
                  <TH label="Email"        col="email" />
                  <TH label="Role"         col="role" />
                  <TH label="Department"   col="department" />
                  <TH label="Experience"   col="experience" />
                  <TH label="Joining Date" col="joining_date" />
                  <TH label="Added"        col="created_at" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium whitespace-nowrap">{s.full_name}</div>
                          <div className="text-slate-500 text-xs">{s.qualification}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/91${s.phone.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-mono transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />{s.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-brand-500/15 text-brand-300 text-xs px-2 py-0.5 rounded-md">{s.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-emerald-500/15 text-emerald-300 text-xs px-2 py-0.5 rounded-md">{s.department}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">{s.experience}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">{s.joining_date}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setShowForm(false); setEditTarget(s) }}
                          className="text-slate-400 hover:text-brand-400 transition-colors" title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="text-slate-500 hover:text-red-400 transition-colors" title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.full_name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

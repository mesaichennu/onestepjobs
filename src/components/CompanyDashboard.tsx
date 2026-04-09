import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Search, RefreshCw, FileSpreadsheet, FileText,
  Building2, AlertCircle, Loader2, Pencil, Trash2, X, Save,
  ChevronUp, ChevronDown
} from 'lucide-react'
import {
  insertCompany, fetchCompanies, updateCompany, deleteCompany,
  type Company, type CompanyInsert,
} from '../services/supabase'
import { exportCompaniesToPDF, exportCompaniesToExcel } from '../utils/exportUtils'

// ── Constants ─────────────────────────────────────────────────────────────

const BLANK: CompanyInsert = {
  company_name:'', industry:'', contact_person:'', email:'',
  phone:'', location:'', open_roles:'', num_positions:1, description:'',
}

const INDUSTRIES = [
  'Information Technology','Finance & Banking','Healthcare','Manufacturing',
  'Education','Retail & E-Commerce','Media & Advertising','Real Estate',
  'Logistics & Supply Chain','Hospitality & Tourism','Other',
]

// ── Reusable Field wrapper — defined at MODULE level, never re-created ────

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

// ── Confirm delete — module level ─────────────────────────────────────────

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
        <h3 className="font-display font-bold text-white text-lg text-center mb-2">Delete Company</h3>
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

// ── Company Form — module level ───────────────────────────────────────────

function CompanyForm({
  initial, onSave, onCancel, saving,
}: {
  initial: CompanyInsert
  onSave: (d: CompanyInsert) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm]     = useState<CompanyInsert>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync when initial changes (e.g. switching from add→edit)
  useEffect(() => { setForm(initial); setErrors({}) }, [initial])

  function validate(): boolean {
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'num_positions' ? Number(value) : value }))
    setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  return (
    <div className="card border-orange-500/30 mb-6">
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
          <input
            id="company_name" name="company_name"
            value={form.company_name} onChange={handleChange}
            placeholder="Acme Corp"
            className={`input-field ${errors.company_name ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Industry *" name="industry" error={errors.industry}>
          <select
            id="industry" name="industry"
            value={form.industry} onChange={handleChange}
            className={`input-field bg-slate-800 ${errors.industry ? 'border-red-500/60' : ''}`}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>

        <Field label="Contact Person *" name="contact_person" error={errors.contact_person}>
          <input
            id="contact_person" name="contact_person"
            value={form.contact_person} onChange={handleChange}
            placeholder="Rahul Sharma"
            className={`input-field ${errors.contact_person ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Email *" name="email" error={errors.email}>
          <input
            id="email" name="email" type="email"
            value={form.email} onChange={handleChange}
            placeholder="hr@company.com"
            className={`input-field ${errors.email ? 'border-red-500/60' : ''}`}
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

        <Field label="Location *" name="location" error={errors.location}>
          <input
            id="location" name="location"
            value={form.location} onChange={handleChange}
            placeholder="Hyderabad, Telangana"
            className={`input-field ${errors.location ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="Open Roles *" name="open_roles" error={errors.open_roles}>
          <input
            id="open_roles" name="open_roles"
            value={form.open_roles} onChange={handleChange}
            placeholder="Software Engineer, QA, DevOps"
            className={`input-field ${errors.open_roles ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <Field label="No. of Positions *" name="num_positions" error={errors.num_positions}>
          <input
            id="num_positions" name="num_positions" type="number" min={1}
            value={form.num_positions} onChange={handleChange}
            className={`input-field ${errors.num_positions ? 'border-red-500/60' : ''}`}
          />
        </Field>

        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description" name="description"
            value={form.description} onChange={handleChange}
            rows={3} placeholder="Brief about the company or role…"
            className="input-field resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary py-2.5 px-5">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { if (validate()) onSave(form) }}
          disabled={saving}
          className="btn-primary py-2.5 px-5 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Company'}
        </button>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────

type SortKey = keyof Company

export default function CompanyDashboard() {
  const [companies, setCompanies]       = useState<Company[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [search, setSearch]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [editTarget, setEditTarget]     = useState<Company | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null)
  const [saving, setSaving]             = useState(false)
  const [sortKey, setSortKey]           = useState<SortKey>('created_at')
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const { data, error: err } = await fetchCompanies()
    if (err) setError(err.message)
    else setCompanies((data ?? []) as Company[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(form: CompanyInsert) {
    setSaving(true)
    if (editTarget) {
      const { data, error: err } = await updateCompany(editTarget.id, form)
      if (!err && data) setCompanies(prev => prev.map(c => c.id === editTarget.id ? data as Company : c))
    } else {
      const { data, error: err } = await insertCompany(form)
      if (!err && data) setCompanies(prev => [data as Company, ...prev])
    }
    setSaving(false); setShowForm(false); setEditTarget(null)
  }

  async function handleDelete(c: Company) {
    await deleteCompany(c.id)
    setCompanies(prev => prev.filter(x => x.id !== c.id))
    setDeleteTarget(null)
  }

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  const filtered = companies
    .filter(c => {
      const q = search.toLowerCase()
      return (
        c.company_name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.open_roles.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
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
              ? <ChevronUp className="w-3 h-3 text-orange-400" />
              : <ChevronDown className="w-3 h-3 text-orange-400" />
            : <ChevronUp className="w-3 h-3 text-slate-600" />}
        </span>
      </th>
    )
  }

  // Determine form initial value
  const formInitial: CompanyInsert = editTarget
    ? {
        company_name:   editTarget.company_name,
        industry:       editTarget.industry,
        contact_person: editTarget.contact_person,
        email:          editTarget.email,
        phone:          editTarget.phone,
        location:       editTarget.location,
        open_roles:     editTarget.open_roles,
        num_positions:  editTarget.num_positions,
        description:    editTarget.description,
      }
    : BLANK

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Companies',   value: companies.length },
          { label: 'Total Open Positions', value: companies.reduce((a, c) => a + c.num_positions, 0) },
          { label: 'Industries',        value: [...new Set(companies.map(c => c.industry))].length },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="font-display text-3xl font-bold text-white mb-1">{s.value}</div>
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
              placeholder="Search company, industry, roles…"
              className="input-field pl-10"
            />
          </div>
          <button onClick={load} className="btn-secondary py-3 px-4" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => exportCompaniesToExcel(filtered)}
            className="btn-secondary py-3 px-4 hover:border-emerald-500/50 hover:text-emerald-400 whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => exportCompaniesToPDF(filtered)}
            className="btn-secondary py-3 px-4 hover:border-red-500/50 hover:text-red-400 whitespace-nowrap">
            <FileText className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Company
          </button>
        </div>
      </div>

      {/* Form — shown when adding or editing */}
      {(showForm || editTarget !== null) && (
        <CompanyForm
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
            <Building2 className="w-4 h-4 text-orange-400" />
            Registered Companies
            <span className="bg-orange-500/15 text-orange-300 text-xs font-semibold px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-orange-400" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search ? 'No companies match.' : 'No companies registered yet. Add one above.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
                  <TH label="Company"   col="company_name" />
                  <TH label="Industry"  col="industry" />
                  <TH label="Contact"   col="contact_person" />
                  <TH label="Phone"     col="phone" />
                  <TH label="Location"  col="location" />
                  <TH label="Open Roles" col="open_roles" />
                  <TH label="Positions" col="num_positions" />
                  <TH label="Added"     col="created_at" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {c.company_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-medium whitespace-nowrap">{c.company_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-orange-500/15 text-orange-300 text-xs px-2 py-0.5 rounded-md whitespace-nowrap">{c.industry}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{c.contact_person}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm font-mono transition-colors"
                      >
                        {c.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">{c.location}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{c.open_roles}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-white text-sm">{c.num_positions}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setShowForm(false); setEditTarget(c) }}
                          className="text-slate-400 hover:text-brand-400 transition-colors" title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
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
          name={deleteTarget.company_name}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

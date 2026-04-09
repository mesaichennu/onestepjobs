import { useState, useEffect, useCallback } from 'react'
import {
  Search, RefreshCw, FileSpreadsheet, FileText, Users,
  Eye, AlertCircle, Loader2, ChevronUp, ChevronDown,
  ExternalLink, Trash2, MessageCircle, CheckCircle, Clock, XCircle
} from 'lucide-react'
import {
  fetchStudents, updateStudentStatus, deleteStudent,
  type Student, type StudentStatus,
} from '../services/supabase'
import { exportStudentsToPDF, exportStudentsToExcel } from '../utils/exportUtils'

// ── Status badge ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StudentStatus, { label: string; icon: React.ElementType; classes: string }> = {
  pending:  { label: 'Pending',  icon: Clock,        classes: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  selected: { label: 'Selected', icon: CheckCircle,  classes: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  rejected: { label: 'Rejected', icon: XCircle,      classes: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

function StatusBadge({ status }: { status: StudentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  )
}

function StatusDropdown({ current, onChange }: { current: StudentStatus; onChange: (s: StudentStatus) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
        <StatusBadge status={current} />
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl min-w-[130px] overflow-hidden">
          {(Object.keys(STATUS_CONFIG) as StudentStatus[]).map(s => (
            <button key={s} onClick={() => { onChange(s); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-slate-700 transition-colors ${current === s ? 'bg-slate-700/60' : ''}`}>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Confirm delete modal ──────────────────────────────────────────────────

function ConfirmDelete({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="font-display font-bold text-white text-lg text-center mb-2">Delete Student</h3>
        <p className="text-slate-400 text-sm text-center mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 btn-secondary py-2.5 justify-center">Cancel</button>
          <button onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

type SortKey = keyof Student
type SortDir = 'asc' | 'desc'

export default function StudentDashboard() {
  const [students, setStudents]         = useState<Student[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [search, setSearch]             = useState('')
  const [filterState, setFilterState]   = useState('')
  const [filterStatus, setFilterStatus] = useState<StudentStatus | ''>('')
  const [sortKey, setSortKey]           = useState<SortKey>('created_at')
  const [sortDir, setSortDir]           = useState<SortDir>('desc')
  const [selected, setSelected]         = useState<Student | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const { data, error: err } = await fetchStudents()
    if (err) setError(err.message)
    else setStudents((data ?? []) as Student[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  async function handleStatusChange(id: string, status: StudentStatus) {
    setStatusLoading(id)
    const { error: err } = await updateStudentStatus(id, status)
    if (!err) setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    setStatusLoading(null)
  }

  async function handleDelete(student: Student) {
    const { error: err } = await deleteStudent(student.id)
    if (!err) {
      setStudents(prev => prev.filter(s => s.id !== student.id))
      setDeleteTarget(null)
      if (selected?.id === student.id) setSelected(null)
    }
  }

  const uniqueStates = [...new Set(students.map(s => s.state))].sort()

  const filtered = students
    .filter(s => {
      const q = search.toLowerCase()
      const matchSearch = s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) || s.skill.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q)
      return matchSearch &&
        (!filterState  || s.state  === filterState) &&
        (!filterStatus || s.status === filterStatus)
    })
    .sort((a, b) => {
      const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-slate-600" />
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-brand-400" />
      : <ChevronDown className="w-3 h-3 text-brand-400" />
  }

  function TH({ label, col }: { label: string; col: SortKey }) {
    return (
      <th onClick={() => toggleSort(col)}
        className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide cursor-pointer hover:text-white transition-colors select-none whitespace-nowrap">
        <span className="flex items-center gap-1">{label} <SortIcon col={col} /></span>
      </th>
    )
  }

  // Stats
  const total    = students.length
  const pending  = students.filter(s => (s.status ?? 'pending') === 'pending').length
  const selected_ = students.filter(s => s.status === 'selected').length
  const rejected = students.filter(s => s.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Students', value:total,     color:'text-white',         bg:'bg-brand-500/10' },
          { label:'Pending',        value:pending,   color:'text-yellow-400',    bg:'bg-yellow-500/10' },
          { label:'Selected',       value:selected_, color:'text-emerald-400',   bg:'bg-emerald-500/10' },
          { label:'Rejected',       value:rejected,  color:'text-red-400',       bg:'bg-red-500/10' },
        ].map(stat => (
          <div key={stat.label} className="card">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <div className={`font-display text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, skill, district…" className="input-field pl-10" />
          </div>
          <select value={filterState} onChange={e => setFilterState(e.target.value)}
            className="input-field bg-slate-800 w-full md:w-44">
            <option value="">All States</option>
            {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StudentStatus | '')}
            className="input-field bg-slate-800 w-full md:w-40">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={load} className="btn-secondary py-3 px-4" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => exportStudentsToExcel(filtered)}
            className="btn-secondary py-3 px-4 hover:border-emerald-500/50 hover:text-emerald-400 whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => exportStudentsToPDF(filtered)}
            className="btn-secondary py-3 px-4 hover:border-red-500/50 hover:text-red-400 whitespace-nowrap">
            <FileText className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Student Registrations
            <span className="bg-brand-500/15 text-brand-300 text-xs font-semibold px-2 py-0.5 rounded-full">{filtered.length}</span>
          </h2>
          {filtered.length !== students.length && (
            <span className="text-slate-500 text-xs">Filtered from {students.length} total</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-400" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search || filterState || filterStatus ? 'No students match your filters.' : 'No registrations yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">#</th>
                  <TH label="Name"    col="full_name" />
                  <TH label="Phone"   col="phone" />
                  <TH label="Email"   col="email" />
                  <TH label="Skill"   col="skill" />
                  <TH label="State"   col="state" />
                  <TH label="Registered" col="created_at" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Resume</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium whitespace-nowrap">{s.full_name}</div>
                          <div className="text-slate-500 text-xs">{s.qualification}</div>
                        </div>
                      </div>
                    </td>
                    {/* WhatsApp phone link */}
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/91${s.phone.replace(/\D/g,'')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-mono transition-colors group"
                        title="Open in WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {s.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-brand-500/15 text-brand-300 text-xs px-2 py-0.5 rounded-md">{s.skill}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">{s.state}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{fmtDate(s.created_at)}</td>
                    {/* Status dropdown */}
                    <td className="px-4 py-3">
                      {statusLoading === s.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      ) : (
                        <StatusDropdown
                          current={s.status ?? 'pending'}
                          onChange={status => handleStatusChange(s.id, status)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.resume_url ? (
                        <a href={s.resume_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      ) : <span className="text-slate-600 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(s)}
                          className="text-slate-400 hover:text-white transition-colors" title="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)}
                          className="text-slate-500 hover:text-red-400 transition-colors" title="Delete">
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

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-display font-bold text-white text-xl">Student Details</h3>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                <div className="w-14 h-14 bg-brand-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {selected.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-xl">{selected.full_name}</div>
                  <div className="text-slate-400 text-sm">{selected.email}</div>
                  <div className="mt-1"><StatusBadge status={selected.status ?? 'pending'} /></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label:'Phone',         value: selected.phone },
                  { label:'Qualification', value: selected.qualification },
                  { label:'Experience',    value: selected.experience },
                  { label:'Primary Skill', value: selected.skill },
                  { label:'State',         value: selected.state },
                  { label:'District',      value: selected.district },
                  { label:'Registered',    value: fmtDate(selected.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800 rounded-xl p-3">
                    <div className="text-slate-500 text-xs mb-1">{label}</div>
                    <div className="text-white text-sm font-medium">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <a href={`https://wa.me/91${selected.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all text-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                {selected.resume_url && (
                  <a href={selected.resume_url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 btn-primary justify-center text-sm py-2.5">
                    <ExternalLink className="w-4 h-4" /> Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
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

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '../../services/supabase'
import { Plus, Trash2, Download, FileSpreadsheet, FileText, Loader2, RefreshCw, Search } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

type Expense = { id: string; expense_date: string; amount: number; description: string; created_at: string }
type Draft = { expense_date: string; amount: string; description: string }
const today = () => new Date().toLocaleDateString('en-CA')
const money = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0)
const inputClass = 'w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-500'
const blank = (): Draft => ({ expense_date: today(), amount: '', description: '' })

export default function ERPExpenses() {
  const [rows, setRows] = useState<Expense[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([blank()])
  const [fromDate, setFromDate] = useState(today().slice(0, 8) + '01')
  const [toDate, setToDate] = useState(today())
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const { data, error: e } = await supabase.from('erp_daily_expenses').select('*').gte('expense_date', fromDate).lte('expense_date', toDate).order('expense_date', { ascending: false }).order('created_at', { ascending: false })
      if (e) throw e
      setRows((data ?? []) as Expense[])
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load expenses') }
    finally { setLoading(false) }
  }, [fromDate, toDate])
  useEffect(() => { void refresh() }, [refresh])

  const filtered = useMemo(() => rows.filter(x => x.description.toLowerCase().includes(query.toLowerCase())), [rows, query])
  const dayTotals = useMemo(() => {
    const totals = new Map<string, number>()
    filtered.forEach(x => totals.set(x.expense_date, (totals.get(x.expense_date) ?? 0) + Number(x.amount)))
    return [...totals.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])
  const total = filtered.reduce((sum, x) => sum + Number(x.amount), 0)

  function updateDraft(i: number, key: keyof Draft, value: string) {
    setDrafts(old => old.map((r, index) => index === i ? { ...r, [key]: value } : r))
  }
  async function saveExpenses(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      const payload = drafts.filter(x => x.description.trim() && x.amount !== '').map(x => ({ expense_date: x.expense_date, amount: Number(x.amount), description: x.description.trim() }))
      if (!payload.length) throw new Error('Enter at least one expense with date, amount and description.')
      if (payload.some(x => !x.expense_date || !Number.isFinite(x.amount) || x.amount <= 0)) throw new Error('Each expense needs a valid date and an amount greater than zero.')
      const { error: e2 } = await supabase.from('erp_daily_expenses').insert(payload)
      if (e2) throw e2
      setDrafts([blank()]); setNotice(`${payload.length} expense row(s) saved successfully.`); await refresh()
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save expenses') }
    finally { setSaving(false) }
  }
  async function removeExpense(x: Expense) {
    if (!confirm(`Delete this expense of ${money(Number(x.amount))}?`)) return
    const { error: e } = await supabase.from('erp_daily_expenses').delete().eq('id', x.id)
    if (e) setError(e.message); else await refresh()
  }
  function exportExcel() {
    const data = filtered.map(x => ({ Date: x.expense_date, Description: x.description, Amount: Number(x.amount) }))
    data.push(...dayTotals.map(([date, amount]) => ({ Date: date, Description: 'DAY TOTAL', Amount: amount })))
    data.push({ Date: '', Description: 'REPORT TOTAL', Amount: total })
    const ws = XLSX.utils.json_to_sheet(data); ws['!cols'] = [{ wch: 14 }, { wch: 42 }, { wch: 16 }]
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Daily Expenses')
    XLSX.writeFile(wb, `daily-expenses-${fromDate}-to-${toDate}.xlsx`)
  }
  function exportPDF() {
    const doc = new jsPDF(); doc.setFontSize(16); doc.text('Daily Expenses Statement', 14, 17)
    doc.setFontSize(9); doc.text(`Period: ${fromDate} to ${toDate}`, 14, 24)
    autoTable(doc, { startY: 30, head: [['Date', 'Description', 'Amount']], body: filtered.map(x => [x.expense_date, x.description, money(Number(x.amount))]), foot: [['', 'Report Total', money(total)]], styles: { fontSize: 8 }, headStyles: { fillColor: [88, 58, 170] } })
    let y = (doc as any).lastAutoTable?.finalY ?? 40; y += 10
    doc.setFontSize(11); doc.text('Date-wise totals', 14, y)
    autoTable(doc, { startY: y + 4, head: [['Date', 'Day Total']], body: dayTotals.map(([d, n]) => [d, money(n)]), styles: { fontSize: 8 }, headStyles: { fillColor: [88, 58, 170] } })
    doc.save(`daily-expenses-${fromDate}-to-${toDate}.pdf`)
  }

  return <div className="space-y-5">
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-white">Enter Daily Expenses</h3><p className="mt-1 text-xs text-slate-500">Add multiple expense entries. Day totals are calculated automatically.</p></div><div className="rounded-xl bg-purple-500/10 px-4 py-2 text-right"><p className="text-xs text-purple-300">Entered rows total</p><b className="text-lg text-white">{money(drafts.reduce((s, x) => s + (Number(x.amount) || 0), 0))}</b></div></div>
      <form onSubmit={saveExpenses} className="space-y-3">
        {drafts.map((r, i) => <div key={i} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 md:grid-cols-[150px_150px_1fr_42px] md:items-end">
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-400">Date</span><input required type="date" value={r.expense_date} onChange={e => updateDraft(i, 'expense_date', e.target.value)} className={inputClass}/></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-400">Amount (₹)</span><input required min="0.01" step="0.01" type="number" value={r.amount} onChange={e => updateDraft(i, 'amount', e.target.value)} placeholder="0.00" className={inputClass}/></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-400">Description</span><input required value={r.description} onChange={e => updateDraft(i, 'description', e.target.value)} placeholder="Enter expense details" className={inputClass}/></label>
          <button type="button" disabled={drafts.length === 1} onClick={() => setDrafts(old => old.filter((_, index) => index !== i))} className="flex h-10 items-center justify-center rounded-xl border border-slate-700 text-red-400 disabled:opacity-30" title="Remove row"><Trash2 size={16}/></button>
        </div>)}
        <div className="flex flex-wrap justify-between gap-2"><button type="button" onClick={() => setDrafts(old => [...old, blank()])} className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300"><Plus size={16}/> Add Row</button><button disabled={saving} className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save Expenses'}</button></div>
      </form>
    </section>

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-white">Date-wise Expense Statement</h3><p className="mt-1 text-xs text-slate-500">Filter any date range and download the statement.</p></div><div className="flex gap-2"><button onClick={exportExcel} disabled={!filtered.length} className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-40"><FileSpreadsheet size={15}/> Excel</button><button onClick={exportPDF} disabled={!filtered.length} className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-300 disabled:opacity-40"><FileText size={15}/> PDF</button><button onClick={() => void refresh()} className="rounded-xl border border-slate-700 p-2 text-slate-300"><RefreshCw size={15}/></button></div></div>
      <div className="mb-4 grid gap-3 sm:grid-cols-3"><label className="block"><span className="mb-1 block text-xs text-slate-400">From date</span><input type="date" value={fromDate} max={toDate} onChange={e => setFromDate(e.target.value)} className={inputClass}/></label><label className="block"><span className="mb-1 block text-xs text-slate-400">To date</span><input type="date" value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)} className={inputClass}/></label><div className="relative self-end"><Search size={15} className="absolute left-3 top-3 text-slate-500"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search description" className={`${inputClass} pl-9`}/></div></div>
      {error && <p className="mb-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}{notice && <p className="mb-3 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</p>}
      <div className="mb-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Statement total</p><b className="mt-1 block text-2xl text-white">{money(total)}</b></div><div className="rounded-xl bg-slate-950 p-4"><p className="text-xs text-slate-500">Expense entries</p><b className="mt-1 block text-2xl text-white">{filtered.length}</b></div></div>
      {loading ? <p className="flex items-center gap-2 py-8 text-sm text-slate-400"><Loader2 className="animate-spin" size={16}/> Loading expenses…</p> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b border-slate-800 text-xs uppercase text-slate-500"><th className="px-3 py-3">Date</th><th className="px-3 py-3">Description</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3 text-right">Action</th></tr></thead><tbody>{filtered.map(x => <tr key={x.id} className="border-b border-slate-800/70 text-slate-300"><td className="px-3 py-3">{x.expense_date}</td><td className="px-3 py-3">{x.description}</td><td className="px-3 py-3 text-right">{money(Number(x.amount))}</td><td className="px-3 py-3 text-right"><button onClick={() => void removeExpense(x)} className="p-2 text-red-400" title="Delete"><Trash2 size={15}/></button></td></tr>)}{dayTotals.map(([d, n]) => <tr key={`total-${d}`} className="bg-purple-500/5 font-semibold text-purple-200"><td className="px-3 py-3">{d}</td><td className="px-3 py-3">Day Total</td><td className="px-3 py-3 text-right">{money(n)}</td><td/> </tr>)}{!filtered.length && <tr><td colSpan={4} className="px-3 py-10 text-center text-slate-500">No expenses found for this date range.</td></tr>}</tbody></table></div>}
    </section>
  </div>
}

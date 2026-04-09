import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Student, Company, Staff } from '../services/supabase'

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

function pdfHeader(doc: jsPDF, title: string) {
  doc.setFillColor(29, 78, 216)   // brand-700
  doc.rect(0, 0, 297, 20, 'F')
  doc.setFontSize(13); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold')
  doc.text(`OneStep Jobs — ${title}`, 14, 13)
  doc.setFontSize(8); doc.setFont('helvetica','normal')
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 210, 13)
}

function pdfFooter(doc: jsPDF) {
  const n = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= n; i++) {
    doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150)
    doc.text(`Page ${i} of ${n}`, 148, 205, { align:'center' })
    doc.text(`OneStep Jobs © ${new Date().getFullYear()}`, 14, 205)
  }
}

// ── Students ──────────────────────────────────────────────────────────────

export function exportStudentsToPDF(students: Student[], filename = 'students_report') {
  const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' })
  pdfHeader(doc, 'Student Registration Report')
  autoTable(doc, {
    startY: 25,
    head: [['Name','Phone','Email','Qualification','Skill','State','District','Status','Registered']],
    body: students.map(s => [
      s.full_name, s.phone, s.email, s.qualification,
      s.skill, s.state, s.district,
      s.status?.toUpperCase() ?? 'PENDING',
      fmtDate(s.created_at),
    ]),
    styles: { fontSize:7.5, cellPadding:2.5, textColor:[30,30,30] },
    headStyles: { fillColor:[29,78,216], textColor:[255,255,255], fontStyle:'bold' },
    alternateRowStyles: { fillColor:[239,246,255] },
    margin: { left:10, right:10 },
  })
  pdfFooter(doc)
  doc.save(`${filename}_${Date.now()}.pdf`)
}

export function exportStudentsToExcel(students: Student[], filename = 'students_report') {
  const rows = students.map(s => ({
    'Full Name': s.full_name, 'Phone': s.phone, 'Email': s.email,
    'Qualification': s.qualification, 'Experience': s.experience,
    'Skill': s.skill, 'State': s.state, 'District': s.district,
    'Status': s.status ?? 'pending', 'Resume URL': s.resume_url,
    'Registered At': fmtDate(s.created_at),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [22,14,28,18,14,18,14,16,12,45,18].map(wch => ({ wch }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`)
}

// Keep old aliases for backward compat
export const exportToPDF   = exportStudentsToPDF
export const exportToExcel = exportStudentsToExcel

// ── Companies ─────────────────────────────────────────────────────────────

export function exportCompaniesToPDF(companies: Company[], filename = 'companies_report') {
  const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' })
  pdfHeader(doc, 'Company Registration Report')
  autoTable(doc, {
    startY: 25,
    head: [['Company','Industry','Contact','Email','Phone','Location','Open Roles','Positions','Registered']],
    body: companies.map(c => [
      c.company_name, c.industry, c.contact_person, c.email, c.phone,
      c.location, c.open_roles, c.num_positions, fmtDate(c.created_at),
    ]),
    styles: { fontSize:7.5, cellPadding:2.5, textColor:[30,30,30] },
    headStyles: { fillColor:[249,115,22], textColor:[255,255,255], fontStyle:'bold' },
    alternateRowStyles: { fillColor:[255,247,237] },
    margin: { left:10, right:10 },
  })
  pdfFooter(doc)
  doc.save(`${filename}_${Date.now()}.pdf`)
}

export function exportCompaniesToExcel(companies: Company[], filename = 'companies_report') {
  const rows = companies.map(c => ({
    'Company Name': c.company_name, 'Industry': c.industry,
    'Contact Person': c.contact_person, 'Email': c.email, 'Phone': c.phone,
    'Location': c.location, 'Open Roles': c.open_roles,
    'No. of Positions': c.num_positions, 'Description': c.description,
    'Registered At': fmtDate(c.created_at),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [22,16,20,26,14,18,24,16,30,18].map(wch => ({ wch }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Companies')
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`)
}

// ── Staff ─────────────────────────────────────────────────────────────────

export function exportStaffToPDF(staff: Staff[], filename = 'staff_report') {
  const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' })
  pdfHeader(doc, 'Staff Registration Report')
  autoTable(doc, {
    startY: 25,
    head: [['Name','Phone','Email','Role','Department','Qualification','Experience','Joining Date','Added']],
    body: staff.map(s => [
      s.full_name, s.phone, s.email, s.role, s.department,
      s.qualification, s.experience, s.joining_date, fmtDate(s.created_at),
    ]),
    styles: { fontSize:7.5, cellPadding:2.5, textColor:[30,30,30] },
    headStyles: { fillColor:[5,150,105], textColor:[255,255,255], fontStyle:'bold' },
    alternateRowStyles: { fillColor:[236,253,245] },
    margin: { left:10, right:10 },
  })
  pdfFooter(doc)
  doc.save(`${filename}_${Date.now()}.pdf`)
}

export function exportStaffToExcel(staff: Staff[], filename = 'staff_report') {
  const rows = staff.map(s => ({
    'Full Name': s.full_name, 'Phone': s.phone, 'Email': s.email,
    'Role': s.role, 'Department': s.department,
    'Qualification': s.qualification, 'Experience': s.experience,
    'Joining Date': s.joining_date, 'Added At': fmtDate(s.created_at),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [22,14,26,18,16,18,14,14,18].map(wch => ({ wch }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Staff')
  XLSX.writeFile(wb, `${filename}_${Date.now()}.xlsx`)
}

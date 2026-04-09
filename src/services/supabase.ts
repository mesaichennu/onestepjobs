import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(
  supabaseUrl     || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// ── Types ──────────────────────────────────────────────────────────────────

export type StudentStatus = 'pending' | 'selected' | 'rejected'

export interface Student {
  id: string; full_name: string; phone: string; email: string
  qualification: string; experience: string; skill: string
  state: string; district: string; resume_url: string
  status: StudentStatus; created_at: string
}
export type StudentInsert = Omit<Student, 'id' | 'created_at' | 'status'>

export interface Company {
  id: string; company_name: string; industry: string
  contact_person: string; email: string; phone: string
  location: string; open_roles: string; num_positions: number
  description: string; created_at: string
}
export type CompanyInsert = Omit<Company, 'id' | 'created_at'>

export interface Staff {
  id: string; full_name: string; phone: string; email: string
  role: string; department: string; qualification: string
  experience: string; joining_date: string; created_at: string
}
export type StaffInsert = Omit<Staff, 'id' | 'created_at'>

// ── Student ops ────────────────────────────────────────────────────────────
export const insertStudent      = (d: StudentInsert)                    => supabase.from('students').insert([d]).select().single()
export const fetchStudents      = ()                                     => supabase.from('students').select('*').order('created_at',{ascending:false})
export const updateStudentStatus= (id:string, status:StudentStatus)     => supabase.from('students').update({status}).eq('id',id)
export const deleteStudent      = (id:string)                           => supabase.from('students').delete().eq('id',id)

// ── Company ops ────────────────────────────────────────────────────────────
export const insertCompany  = (d: CompanyInsert)                   => supabase.from('companies').insert([d]).select().single()
export const fetchCompanies = ()                                    => supabase.from('companies').select('*').order('created_at',{ascending:false})
export const updateCompany  = (id:string, d:Partial<CompanyInsert>)=> supabase.from('companies').update(d).eq('id',id).select().single()
export const deleteCompany  = (id:string)                          => supabase.from('companies').delete().eq('id',id)

// ── Staff ops ──────────────────────────────────────────────────────────────
export const insertStaff = (d: StaffInsert)                   => supabase.from('staff').insert([d]).select().single()
export const fetchStaff  = ()                                  => supabase.from('staff').select('*').order('created_at',{ascending:false})
export const updateStaff = (id:string, d:Partial<StaffInsert>)=> supabase.from('staff').update(d).eq('id',id).select().single()
export const deleteStaff = (id:string)                        => supabase.from('staff').delete().eq('id',id)

// ── Resume upload ──────────────────────────────────────────────────────────
export async function uploadResume(file: File, email: string): Promise<string> {
  const path = `${email.replace(/[^a-z0-9]/gi,'_').toLowerCase()}_${Date.now()}.pdf`
  const { error } = await supabase.storage.from('resumes').upload(path, file, { contentType:'application/pdf', upsert:false })
  if (error) throw error
  return supabase.storage.from('resumes').getPublicUrl(path).data.publicUrl
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const adminSignIn  = (email:string, password:string) => supabase.auth.signInWithPassword({email,password})
export const adminSignOut = ()                               => supabase.auth.signOut()
export const getSession   = ()                               => supabase.auth.getSession()

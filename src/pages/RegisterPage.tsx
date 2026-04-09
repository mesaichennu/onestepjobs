import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { CheckCircle, AlertCircle, Upload, Loader2, User, Phone, Mail, GraduationCap, Briefcase, Code, MapPin, FileText, X } from 'lucide-react'
import { insertStudent, uploadResume } from '../services/supabase'

/* ─── Static data ──────────────────────────────────────────────────── */

const QUALIFICATIONS = [
  'High School (10th)',
  'Higher Secondary (12th)',
  'Diploma',
  "Bachelor's Degree (B.E/B.Tech)",
  "Bachelor's Degree (B.Sc/B.Com/BA)",
  "Master's Degree (M.E/M.Tech)",
  "Master's Degree (M.Sc/MBA/MCA)",
  'Ph.D / Doctorate',
  'Other',
]

const EXPERIENCE_OPTIONS = [
  'Fresher (0 years)',
  '0–1 Year',
  '1–2 Years',
  '2–3 Years',
  '3–5 Years',
  '5–7 Years',
  '7–10 Years',
  '10+ Years',
]

const SKILLS = [
  'Web Development', 'Mobile Development', 'Data Science / ML',
  'DevOps / Cloud', 'UI/UX Design', 'Digital Marketing',
  'Business Development', 'Finance / Accounting',
  'Human Resources', 'Operations Management', 'Other',
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
]

/* ─── Types ────────────────────────────────────────────────────────── */

interface FormData {
  full_name: string
  phone: string
  email: string
  qualification: string
  experience: string
  skill: string
  state: string
  district: string
}

interface FormErrors {
  [key: string]: string
}

const INITIAL_FORM: FormData = {
  full_name: '', phone: '', email: '',
  qualification: '', experience: '', skill: '',
  state: '', district: '',
}

/* ─── Validation ───────────────────────────────────────────────────── */

function validate(form: FormData, file: File | null): FormErrors {
  const errors: FormErrors = {}

  if (!form.full_name.trim() || form.full_name.trim().length < 3)
    errors.full_name = 'Full name must be at least 3 characters.'

  if (!/^[6-9]\d{9}$/.test(form.phone))
    errors.phone = 'Enter a valid 10-digit Indian mobile number.'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email address.'

  if (!form.qualification) errors.qualification = 'Please select your qualification.'
  if (!form.experience)    errors.experience    = 'Please select your experience level.'
  if (!form.skill)         errors.skill         = 'Please select a primary skill.'
  if (!form.state)         errors.state         = 'Please select your state.'

  if (!form.district.trim() || form.district.trim().length < 2)
    errors.district = 'Please enter your district.'

  if (!file) {
    errors.resume = 'Please upload your resume.'
  } else if (file.type !== 'application/pdf') {
    errors.resume = 'Only PDF files are accepted.'
  } else if (file.size > 5 * 1024 * 1024) {
    errors.resume = 'File size must be under 5 MB.'
  }

  return errors
}

/* ─── Field wrapper ────────────────────────────────────────────────── */

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

/* ─── Component ────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    if (errors.resume) setErrors(prev => { const n = { ...prev }; delete n.resume; return n })
  }

  function removeFile() {
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(form, file)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    setErrorMsg('')

    try {
      const resumeUrl = await uploadResume(file!, form.email)
      const { error } = await insertStudent({ ...form, resume_url: resumeUrl })
      if (error) throw error
      setStatus('success')
      setForm(INITIAL_FORM)
      setFile(null)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    }
  }

  /* ── Success state ───────────────────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center card border-emerald-500/30">
          <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">You're Registered!</h2>
          <p className="text-slate-400 leading-relaxed mb-6">
            Your profile and resume have been submitted successfully. Our team will review your
            application and reach out within 48 hours.
          </p>
          <div className="space-y-3 text-sm text-slate-300 bg-slate-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Profile saved to our database</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Resume uploaded securely</div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Team notified — expect a call soon</div>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="btn-primary w-full justify-center"
          >
            Register Another Student
          </button>
        </div>
      </div>
    )
  }

  /* ── Form ────────────────────────────────────────────────────────── */
  return (
    <div className="pt-16 min-h-screen pb-20">
      {/* Header */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-2xl mx-auto px-4">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-4">Student Registration</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Start Your Career Journey
          </h1>
          <p className="text-slate-400 text-lg">
            Complete the form below to join 12,000+ students already placed through OneStep Jobs.
            It takes under 2 minutes.
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-4">
        {status === 'error' && (
          <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-400 font-semibold text-sm">Submission Failed</p>
              <p className="text-red-300 text-sm mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="card border-slate-700/50 space-y-6">
          <h2 className="font-display text-xl font-semibold text-white border-b border-slate-800 pb-4">
            Personal Information
          </h2>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name *" error={errors.full_name}>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="full_name" type="text" value={form.full_name}
                  onChange={handleChange} placeholder="Ravi Kumar"
                  className={`input-field pl-10 ${errors.full_name ? 'border-red-500/60' : ''}`}
                />
              </div>
            </Field>

            <Field label="Phone Number *" error={errors.phone}>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder="9876543210"
                  maxLength={10}
                  className={`input-field pl-10 ${errors.phone ? 'border-red-500/60' : ''}`}
                />
              </div>
            </Field>
          </div>

          {/* Email */}
          <Field label="Email Address *" error={errors.email}>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="ravi@example.com"
                className={`input-field pl-10 ${errors.email ? 'border-red-500/60' : ''}`}
              />
            </div>
          </Field>

          {/* Divider */}
          <h2 className="font-display text-xl font-semibold text-white border-b border-slate-800 pb-4 pt-2">
            Academic & Professional Details
          </h2>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Highest Qualification *" error={errors.qualification}>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  name="qualification" value={form.qualification}
                  onChange={handleChange}
                  className={`input-field pl-10 bg-slate-800 ${errors.qualification ? 'border-red-500/60' : ''}`}
                >
                  <option value="">Select qualification</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </Field>

            <Field label="Work Experience *" error={errors.experience}>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  name="experience" value={form.experience}
                  onChange={handleChange}
                  className={`input-field pl-10 bg-slate-800 ${errors.experience ? 'border-red-500/60' : ''}`}
                >
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </Field>
          </div>

          {/* Skill */}
          <Field label="Primary Skill *" error={errors.skill}>
            <div className="relative">
              <Code className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select
                name="skill" value={form.skill}
                onChange={handleChange}
                className={`input-field pl-10 bg-slate-800 ${errors.skill ? 'border-red-500/60' : ''}`}
              >
                <option value="">Select a skill domain</option>
                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Field>

          {/* Divider */}
          <h2 className="font-display text-xl font-semibold text-white border-b border-slate-800 pb-4 pt-2">
            Location
          </h2>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="State *" error={errors.state}>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  name="state" value={form.state}
                  onChange={handleChange}
                  className={`input-field pl-10 bg-slate-800 ${errors.state ? 'border-red-500/60' : ''}`}
                >
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </Field>

            <Field label="District *" error={errors.district}>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  name="district" type="text" value={form.district}
                  onChange={handleChange} placeholder="e.g. Ranga Reddy"
                  className={`input-field pl-10 ${errors.district ? 'border-red-500/60' : ''}`}
                />
              </div>
            </Field>
          </div>

          {/* Resume upload */}
          <div>
            <h2 className="font-display text-xl font-semibold text-white border-b border-slate-800 pb-4 pt-2 mb-5">
              Resume Upload
            </h2>
            <Field label="Resume (PDF only, max 5 MB) *" error={errors.resume}>
              {!file ? (
                <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all
                  ${errors.resume ? 'border-red-500/50 bg-red-500/5' : 'border-slate-600 hover:border-brand-500/60 hover:bg-brand-500/5 bg-slate-800/50'}`}>
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-slate-400 text-sm">Click to upload or drag & drop</span>
                  <span className="text-slate-600 text-xs mt-1">PDF files only — max 5 MB</span>
                  <input
                    ref={fileRef}
                    type="file" accept=".pdf,application/pdf"
                    onChange={handleFile}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 bg-slate-800 border border-brand-500/30 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 bg-brand-500/15 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{file.name}</p>
                    <p className="text-slate-500 text-xs">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  </div>
                  <button type="button" onClick={removeFile}
                    className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </Field>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-gold w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {status === 'loading' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Registration…</>
            ) : (
              'Submit Registration'
            )}
          </button>

          <p className="text-center text-slate-600 text-xs">
            By registering you agree to our Terms of Service and Privacy Policy.
            Your data is stored securely and never shared without consent.
          </p>
        </form>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ArrowRight, Users, Award, Briefcase, TrendingUp, CheckCircle, Star, GraduationCap, Target, Zap } from 'lucide-react'

const STATS = [
  { value: '12,000+', label: 'Students Placed', icon: Users },
  { value: '500+', label: 'Partner Companies', icon: Briefcase },
  { value: '98%', label: 'Satisfaction Rate', icon: Star },
  { value: '15+', label: 'Years Experience', icon: Award },
]

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Expert Mentorship',
    desc: 'Get guided by industry veterans who have walked the path you are on. Personalised career roadmaps designed for your goals.',
  },
  {
    icon: Target,
    title: 'Targeted Placements',
    desc: 'We match your unique skill set and aspirations with roles at companies that value what you bring to the table.',
  },
  {
    icon: Zap,
    title: 'Fast-Track Growth',
    desc: 'From resume building to interview prep — our streamlined process gets you hired in weeks, not months.',
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    desc: 'Track your applications, get market insights, and understand exactly where you stand in the job market.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Infosys',
    avatar: 'PS',
    text: 'OneStep changed my life. Within 3 weeks of registering, I had 4 interview calls and landed my dream job.',
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst @ TCS',
    avatar: 'RV',
    text: 'The mentorship and placement support is unlike anything I have experienced. Highly professional and caring team.',
  },
  {
    name: 'Ananya Reddy',
    role: 'UI Designer @ Wipro',
    avatar: 'AR',
    text: 'I was struggling for 8 months. OneStep helped me refine my portfolio and got me placed in just 2 weeks!',
  },
]

// Inline SVG illustration components
function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full" />
      
      {/* Main card */}
      <div className="relative glass rounded-3xl p-8 border border-brand-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold font-display">Career Dashboard</div>
            <div className="text-brand-400 text-sm">Live placement tracker</div>
          </div>
        </div>

        Progress bars
        <div className="space-y-4 mb-6">
          {[
            { label: 'Profile Complete', pct: 85, color: 'bg-brand-500' },
            { label: 'Skills Verified', pct: 70, color: 'bg-gold-500' },
            { label: 'Applications Sent', pct: 55, color: 'bg-emerald-500' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{item.label}</span>
                <span>{item.pct}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating badges */}
        <div className="flex flex-wrap gap-2">
          {['React', 'Python', 'SQL', 'UI/UX'].map(skill => (
            <span key={skill} className="badge bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 border border-emerald-500/30 animate-float">
        <div className="text-emerald-400 font-bold text-lg">+248</div>
        <div className="text-slate-400 text-xs">Placed this month</div>
      </div>
      <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 border border-gold-500/30 animate-float" style={{ animationDelay: '2s' }}>
        <div className="text-gold-400 font-bold text-lg">4.9 ★</div>
        <div className="text-slate-400 text-xs">Avg. rating</div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
       <section className="relative min-h-screen flex items-center">

      {/* Background Image */}
      <div className="absolute inset-0">
       <picture>
      {/* Mobile image */}
      <source
        media="(max-width: 768px)"
        srcSet="/bg-img-mobile.png"
      />

      {/* Desktop image */}
      <img
        src="/bg-img.png"
        alt="Hero"
        className="w-full h-full object-cover"
      />
      </picture>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-xl">

          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">
              Trusted by 500+ Companies
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Build Your{" "}
            <span className="text-orange-400">Dream Career</span>{" "}
            With Us
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-8">
            Register your profile, upload your resume, and get matched with top companies.
            Start your journey towards success today.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              to="/register"
              className="bg-orange-400 text-black font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-300 transition"
            >
              Register Now <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/services"
              className="border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap gap-4">
            {[
              "Free Registration",
              "Resume Support",
              "Interview Opportunities"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-gray-300 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
<section className="relative py-24 overflow-hidden">

  {/* Background Image */}
  <div className="absolute inset-0">
          <picture>
      {/* Mobile image */}
      <source
        media="(max-width: 768px)"
        srcSet="/bg2-mobile.png"
      />

      {/* Desktop image */}
      <img
        src="/bg2.png"
        alt="Hero"
        className="w-full h-full object-cover"
      />
      </picture>

    {/* Dark overlay */}
    <div className="absolute inset-0 " />

    {/* Gradient overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
  </div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-16">
      <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">
        Why OneStep
      </p>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Everything You Need to Succeed
      </h2>

      <p className="text-gray-300 max-w-2xl mx-auto">
        Our platform provides the right tools, guidance, and opportunities to accelerate your career journey.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {FEATURES.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className=" bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/40 hover:bg-white/10 transition duration-300 group"
        >
          <div className="w-12 h-12 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-xl flex items-center justify-center mb-5 transition">
            <Icon className="w-6 h-6 text-yellow-400" />
          </div>

          <h3 className="font-semibold text-white text-lg mb-2">
            {title}
          </h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            {desc}
          </p>
        </div>
      ))}

    </div>
  </div>
</section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Process</p>
            <h2 className="section-heading mb-4">Three Steps to Your New Job</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-brand-600/0 via-brand-500/50 to-brand-600/0" />
            {[
              { step: '01', title: 'Register & Upload', desc: 'Fill in your profile and upload your PDF resume in under 2 minutes.' },
              { step: '02', title: 'Get Matched', desc: 'Our team reviews your profile and matches you with relevant job openings.' },
              { step: '03', title: 'Get Hired', desc: 'Attend interviews, receive offers, and launch your career with confidence.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-brand-500/30">
                  <span className="font-mono font-bold text-white text-lg">{step}</span>
                </div>
                <h3 className="font-display font-semibold text-white text-xl mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="section-heading mb-4">Voices of Our Community</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, text }) => (
              <div key={name} className="card-hover relative">
                <div className="text-gold-400 text-3xl font-serif leading-none mb-4">"</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{name}</div>
                    <div className="text-slate-500 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-brand-800/60" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            Ready to Take the Leap?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join 12,000+ students who found their path through OneStep Jobs. Registration is free, always.
          </p>
          <Link to="/register" className="btn-gold text-lg py-4 px-10 inline-flex">
            Start Your Journey <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

import { Target, Eye, Heart, Users, Award, Globe, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";
import { Briefcase, Building2, Layers } from "lucide-react";

const MILESTONES = [
  {
    year: "2020",
    title: "Founded in Ongole",
    desc: "Started with a team of 5 and a vision to change how India hires.",
    align: "left",
    image: "/images/3.png",
    imageAlt: "Person pointing to a startup milestone board",
  },
  {
    year: "2022",
    title: "Expanded to 5 States",
    desc: "Reached 10,000 placements and opened offices in Mumbai, Bengaluru, Chennai, and Delhi.",
    align: "right",
    image: "/images/2.png",
    imageAlt: "Person pointing upward with success gesture",
  },
  {
    year: "2023",
    title: "Digital Transformation",
    desc: "Launched our online platform, making registration accessible from any corner of India.",
    align: "left",
    image: "/images/5.png",
    imageAlt: "Person holding a laptop and pointing",
  },
  {
    year: "2025",
    title: "Pan-India Presence",
    desc: "Achieved 10,000+ active corporate partnerships and served students from all 28 states.",
    align: "right",
    image: "/images/4.png",
    imageAlt: "Person pointing at a digital growth chart",
  },
  {
    year: "2026",
    title: "12,000+ Placements",
    desc: "Crossed a major milestone and introduced AI-powered skill matching for faster placements.",
    align: "left",
    image: "/images/6.png",
    imageAlt: "Person pointing confidently in a success pose",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Student First',
    desc: 'Every decision we make puts student outcomes at the forefront. Your success is our success.',
  },
  {
    icon: Award,
    title: 'Excellence',
    desc: 'We partner only with companies that uphold high standards of workplace culture and growth.',
  },
  {
    icon: Globe,
    title: 'Inclusivity',
    desc: 'Career opportunities should be accessible to every talented individual, regardless of background.',
  },
  {
    icon: Users,
    title: 'Community',
    desc: 'We build lasting professional communities that support each other long after placement.',
  },
]

const TEAM = [
  { name: 'Dr. Arjun Mehta', role: 'Founder & CEO', initials: 'AM', bg: 'from-brand-600 to-brand-800' },
  { name: 'Sunita Rao', role: 'Head of Placements', initials: 'SR', bg: 'from-purple-600 to-purple-800' },
  { name: 'Kiran Patel', role: 'Lead Mentor', initials: 'KP', bg: 'from-emerald-600 to-emerald-800' },
  { name: 'Divya Nair', role: 'HR Partnerships', initials: 'DN', bg: 'from-gold-500 to-gold-700' },
]

export default function AboutPage() {
  return (
    <div className="pt-16 overflow-x-hidden">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/bg3.png"
          alt="Our Story"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0" />

        {/* Gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
      </div>

  {/* Content */}
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

    <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-4">
      Our Story
    </p>

    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
      We Believe Every Student Deserves a{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
        Great Start
      </span>
    </h1>

    <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
      Founded in 2009, OneStep Jobs was born from a simple frustration — brilliant graduates unable
      to find jobs, while companies struggled to find the right talent. We set out to fix that.
    </p>

  </div>
</section>

      {/* ── Mission & Vision ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="card border-brand-500/30 relative overflow-hidden group hover:border-brand-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-500/10 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-brand-500/15 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-brand-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">Our Mission</h2>
                </div>
                <p className="text-slate-400 leading-relaxed mb-4">
                  To democratise career opportunities across India by connecting skilled graduates with
                  meaningful employment. We provide the tools, mentorship, and networks that transform
                  potential into professional achievement.
                </p>
                <ul className="space-y-2">
                  {['Free registration for all students', 'Personalised career roadmaps', 'Direct recruiter connections'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div className="card border-orange-500/30 relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-colors" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-orange-500/15 rounded-2xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-white">Our Vision</h2>
                </div>
                <p className="text-slate-400 leading-relaxed mb-4">
                  By 2030, we envision a India where no qualified graduate is unemployed and no growing
                  company lacks the talent it needs. OneStep Jobs will be the trusted bridge for
                  one million career journeys every year.
                </p>
                <ul className="space-y-2">
                  {['1M+ placements by 2030', 'Present in all 28 states', 'Pan-India industry partnerships'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



    <section className="relative py-24 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">
            Milestones
          </p>
          <h2 className="section-heading">Our Journey So Far</h2>
        </div>

        <div className="relative">

          {/* Desktop vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-brand-500/20 to-transparent hidden md:block" />

          {/* Mobile vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/40 via-brand-500/20 to-transparent md:hidden" />

          <div className="space-y-12 md:space-y-14">

            {MILESTONES.map(({ year, title, desc, align, image, imageAlt }) => {
              const isLeft = align === "left";

              return (
                <div
                  key={year}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-start"
                >

                  {/* ================= MOBILE ================= */}
                  <div className="flex md:hidden gap-4">

                    {/* Dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-brand-600 border-4 border-slate-950 rounded-full flex items-center justify-center z-10">
                        <span className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">

                      {/* Image */}
                      <motion.img
                        src={image}
                        alt={imageAlt}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="w-28 mb-3 object-contain drop-shadow-xl"
                      />

                      {/* Card */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.6 }}
                        transition={{ duration: 0.5 }}
                        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 will-change-transform"
                      >
                        <span className="text-brand-400 text-xs mb-2 block">{year}</span>
                        <h3 className="text-white font-semibold text-base mb-1">{title}</h3>
                        <p className="text-slate-400 text-sm">{desc}</p>
                      </motion.div>

                    </div>
                  </div>

                  {/* ================= DESKTOP IMAGE ================= */}
                  <div className={`${isLeft ? "md:order-3" : "md:order-1"} hidden md:block`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? 40 : -40, scale: 0.9 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
                    >
                      <img
                        src={image}
                        alt={imageAlt}
                        className="w-44 lg:w-56 object-contain drop-shadow-2xl"
                      />
                    </motion.div>
                  </div>

                  {/* ================= DESKTOP DOT ================= */}
                  <div className="hidden md:flex md:order-2 flex-col items-center">
                    <div className="w-10 h-10 bg-brand-600 border-4 border-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/20">
                      <span className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* ================= DESKTOP CARD ================= */}
                  <div className={`${isLeft ? "md:order-1" : "md:order-3"} hidden md:block`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.6 }}
                      transition={{ duration: 0.5 }}
                      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-500/30 transition will-change-transform"
                    >
                      <span className="text-brand-400 text-xs mb-2 block">{year}</span>
                      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                      <p className="text-slate-400 text-sm">{desc}</p>
                    </motion.div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      </div>
    </section>

      {/* ── Values ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Culture</p>
            <h2 className="section-heading">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover text-center group">
                <div className="w-14 h-14 bg-brand-500/10 group-hover:bg-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-brand-400" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">

  {/* Background glow */}
  <div className="absolute inset-0">
<img
  src="/bg5.png"
  alt="Team Background"
  className="w-full h-full object-cover opacity-20"
/>
<div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
</div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center max-w-3xl mx-auto mb-14">
      <p className="text-yellow-400 font-semibold text-sm uppercase tracking-widest mb-3">
        Who We Are
      </p>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
        Connecting Talent with Real Opportunities
      </h2>

      <p className="text-gray-300 leading-relaxed">
        OneStep Jobs is a recruitment and job support platform that connects job seekers
        with verified employment opportunities across private companies and project-based roles.
        We simplify the hiring process — from registration to final placement.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      {[
        {
          icon: Briefcase,
          title: "Private Jobs",
          desc: "Direct hiring opportunities from verified private companies.",
        },
        {
          icon: Layers,
          title: "Outsourced Projects",
          desc: "Exclusive project-based roles from trusted contractors.",
        },
        {
          icon: Building2,
          title: "Contract Roles",
          desc: "Flexible contract-based positions across industries.",
        },
        {
          icon: Users,
          title: "Direct Hiring",
          desc: "We connect candidates directly with employers for faster placement.",
        },
      ].map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/40 hover:bg-white/10 transition duration-300 text-center group"
        >
          <div className="w-14 h-14 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition">
            <Icon className="w-6 h-6 text-yellow-400" />
          </div>

          <h3 className="text-white font-semibold text-lg mb-2">
            {title}
          </h3>

          <p className="text-gray-400 text-sm">
            {desc}
          </p>
        </div>
      ))}

    </div>

    {/* Bottom statement */}
    <div className="text-center mt-12">
      <p className="text-gray-400 italic max-w-2xl mx-auto">
        “We provide recruitment support for Private Companies, Outsourcing Projects,
        and Contract-based roles.”
      </p>
    </div>

  </div>
</section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-brand-900/60 to-slate-900/80 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Be Part of Our Story
          </h2>
          <p className="text-slate-400 mb-7">
            Thousands of students have already transformed their lives through OneStep. Your turn starts now.
          </p>
          <Link to="/register" className="btn-primary text-base py-3.5 px-8">
            Register Today <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

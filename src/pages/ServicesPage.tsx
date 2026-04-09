import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, FileText, Users, Briefcase } from "lucide-react";

const SERVICES = [
  {
    icon: FileText,
    title: "Student Registration",
    desc: "Submit your details and upload your resume to get started with our placement support.",
  },
  {
    icon: Users,
    title: "Profile Shortlisting",
    desc: "We analyze your profile and match you with suitable job opportunities.",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    desc: "Get connected with companies actively hiring candidates like you.",
  },
];

const STEPS = [
  "Register your details",
  "Upload your resume",
  "Get shortlisted by our team",
  "Receive interview calls",
  "Get placed in a company",
];

export default function ServicesPage() {
  return (
    <div className="pt-16">

     {/* ── Header ── */}
<section className="relative py-24 text-center overflow-hidden">

  {/* Background */}
  <div className="absolute inset-0">
    <img
      src="/bg4.png"
      alt="Our Services"
      className="w-full h-full object-cover"
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 " />

    {/* Gradient overlay (better text visibility) */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
      Our Services
    </h1>

    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
      We help students connect with the right job opportunities and build successful careers.
    </p>

  </div>
</section>

      {/* ── Services ── */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {SERVICES.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-yellow-400/50 transition">
                <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            How It Works
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center mb-3">
                  {i + 1}
                </div>
                <p className="text-gray-300 text-sm text-center">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4 text-center">
          {[
            "100% Free Registration",
            "Direct Company Opportunities",
            "Fast Response & Support",
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-gray-300">
              <CheckCircle className="text-green-400 w-5 h-5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Start Your Career Journey Today
        </h2>
        <p className="text-gray-400 mb-6">
          Register now and get access to job opportunities.
        </p>

        <Link
          to="/register"
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-yellow-300 transition"
        >
          Register Now <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

    </div>
  );
}
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <div className="inline-block bg-white rounded-xl px-2 py-2 shadow-md">
                <img src="/logo.jpeg" alt="OneStep Jobs" className="h-14 w-auto object-contain" style={{ mixBlendMode:'multiply' }} />
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Bridging talented students with leading employers across India.
              One Step to Your Career — starts right here.
            </p>
            <div className="flex gap-3 mt-5">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center transition-colors group">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/',         label: 'Home' },
                { to: '/about',    label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/register', label: 'Register Now' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                { Icon: Mail,   text: 'onestepjobs2@gmail.com' },
                { Icon: Phone,  text: '+91 87 22 334 335' },
                { Icon: MapPin, text: 'Hyderabad, Telangana, India' },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-slate-400 text-sm">
                  <Icon className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} OneStep Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

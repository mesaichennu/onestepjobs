import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/register', label: 'Register', cta: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-950/92 backdrop-blur-md border-b border-slate-800/70 shadow-xl shadow-slate-950/60'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center group">
            {/* White pill so the logo pops on dark bg without its own bg */}
            <div className=" rounded-xl px-3 py-1.5 shadow-md group-hover:shadow-orange-500/2 transition-shadow">
              <img
                src="/logo.jpeg"
                alt="OneStep Jobs"
                className="h-28 w-38 object-contain mt-3"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link =>
              link.cta ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="ml-3 inline-flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400
                             text-white font-bold rounded-xl transition-all duration-200 shadow-lg
                             shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-0.5 text-sm"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* ── Mobile burger ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <div className="md:hidden border-t border-slate-800 py-3 pb-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  link.cta
                    ? 'bg-orange-500 text-white font-bold text-center mt-2'
                    : location.pathname === link.to
                      ? 'text-brand-400 bg-brand-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}

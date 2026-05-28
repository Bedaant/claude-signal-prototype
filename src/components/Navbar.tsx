import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SignalLogo from './SignalLogo'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Playground', href: '/playground' },
  { label: 'Demo', href: '/demo/risky' },
  { label: 'Calibration', href: '/calibration' },
  { label: 'About', href: '/about' },
]

const demoLinks = [
  { label: 'Clean Code', href: '/demo/clean', color: 'bg-signal-green' },
  { label: 'Risky Code', href: '/demo/risky', color: 'bg-signal-yellow' },
  { label: 'Unsafe Code', href: '/demo/unsafe', color: 'bg-signal-red' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10);
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf);
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href === '/demo/risky') return location.pathname.startsWith('/demo')
    return location.pathname === href
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/70 backdrop-blur-xl border-b border-border-subtle'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <SignalLogo size={26} className="text-accent" />
            <span className="font-semibold text-[15px] tracking-tight text-text-primary group-hover:text-accent transition-colors">
              Signal
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/playground"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15 hover:border-accent/30 transition-all"
            >
              <SignalLogo size={14} className="text-accent" animated={false} />
              Try Signal
            </Link>
            <button
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border-subtle bg-surface-glass backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-text-primary bg-surface-active'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-border-subtle">
                <p className="px-3 text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1.5">
                  Demo Scenarios
                </p>
                <div className="space-y-0.5">
                  {demoLinks.map((demo) => (
                    <Link
                      key={demo.href}
                      to={demo.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-text-secondary hover:bg-surface-hover transition-colors"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${demo.color}`} />
                      {demo.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

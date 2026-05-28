import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Playground', href: '/playground' },
  { label: 'Demo', href: '/demo/risky' },
  { label: 'Calibration', href: '/calibration' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href === '/demo/risky') return location.pathname.startsWith('/demo')
    return location.pathname === href
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-accent font-bold text-lg">
            <Shield className="w-5 h-5" />
            <span>Claude Signal</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.label} className="relative">
                {link.label === 'Demo' ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDemoOpen(true)}
                    onMouseLeave={() => setDemoOpen(false)}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? 'text-accent bg-accent/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${demoOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    <AnimatePresence>
                      {demoOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-40 bg-surface border border-border rounded-lg shadow-xl overflow-hidden"
                        >
                          <Link
                            to="/demo/clean"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            onClick={() => setDemoOpen(false)}
                          >
                            <span className="w-2 h-2 rounded-full bg-signal-green" />
                            Clean Code
                          </Link>
                          <Link
                            to="/demo/risky"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            onClick={() => setDemoOpen(false)}
                          >
                            <span className="w-2 h-2 rounded-full bg-signal-yellow" />
                            Risky Code
                          </Link>
                          <Link
                            to="/demo/unsafe"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            onClick={() => setDemoOpen(false)}
                          >
                            <span className="w-2 h-2 rounded-full bg-signal-red" />
                            Unsafe Code
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-accent bg-accent/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-bg/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.href)
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2">
                <p className="px-3 text-xs text-text-muted uppercase tracking-wider mb-1">Scenarios</p>
                <Link to="/demo/clean" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                  <span className="w-2 h-2 rounded-full bg-signal-green" /> Clean
                </Link>
                <Link to="/demo/risky" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                  <span className="w-2 h-2 rounded-full bg-signal-yellow" /> Risky
                </Link>
                <Link to="/demo/unsafe" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                  <span className="w-2 h-2 rounded-full bg-signal-red" /> Unsafe
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

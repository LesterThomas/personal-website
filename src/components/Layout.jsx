import { Link, useLocation } from 'react-router-dom';
import { Twitter, Linkedin } from 'lucide-react';

/**
 * Layout component - Authory-style hero header with profile + nav
 */
export default function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navLinkClass = (path) =>
    isActive(path)
      ? 'text-sm font-semibold text-white border-b-2 border-white/80 pb-0.5 transition-colors duration-150'
      : 'text-sm font-medium text-white/60 hover:text-white pb-0.5 transition-colors duration-150';

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Header — dark slate background matching Authory */}
      <header className="bg-hero text-white">
        <div className="max-w-3xl mx-auto px-6">
          {/* Social links top-right */}
          <div className="flex justify-end items-center gap-4 pt-5 pb-1">
            <a
              href="https://x.com/lesterthomas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/90 transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/lesterthomas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/90 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Centered profile */}
          <div className="flex flex-col items-center text-center pt-4 pb-10">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-white/25 mb-4 overflow-hidden bg-white/15">
              <img
                src="/profile.jpg"
                alt="Lester Thomas"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
              />
              <span className="w-full h-full text-2xl font-bold text-white/90 select-none tracking-tight items-center justify-center hidden" style={{display:'none'}}>LT</span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Lester Thomas
            </h1>

            <p className="text-white/65 text-sm leading-relaxed max-w-sm">
              Dad to 3 lovely kids, tech geek, Head of New Technologies and Innovation, Vodafone Digital &amp; IT.
              Loves eco-friendly tech, robots, Microlights, drones, open-source&hellip;
            </p>

            {/* Page navigation */}
            <nav className="flex items-center gap-7 mt-7">
              <Link to="/" className={navLinkClass('/')}>Home</Link>
              <Link to="/timeline" className={navLinkClass('/timeline')}>Timeline</Link>
              <Link to="/about" className={navLinkClass('/about')}>About</Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Thin separator line between hero and content */}
      <div className="h-px bg-gray-200" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Lester Thomas · Head of New Technologies and Innovation, Vodafone Digital & IT
          </p>
        </div>
      </footer>
    </div>
  );
}

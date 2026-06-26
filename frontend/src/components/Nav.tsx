import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../store/CartContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/learn', label: 'Learn' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<'EN' | 'JP'>('EN');
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenu(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-carbon/85 backdrop-blur-xl border-b border-white/10'
          : 'bg-gradient-to-b from-carbon/80 to-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-[72px] flex items-center justify-between gap-6">
        {/* wordmark */}
        <Link to="/" className="shrink-0" aria-label="KAEN Performance Composite home">
          <img src="/kaen_logo.avif" alt="KAEN" className="h-7 w-auto" />
        </Link>

        {/* center nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `link-sweep font-[Archivo] text-[0.82rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  isActive ? 'text-bone' : 'text-steel hover:text-bone'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* utilities */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setLang((p) => (p === 'EN' ? 'JP' : 'EN'))}
            className="eyebrow text-steel hover:text-bone transition-colors px-2 py-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
            aria-label={`Switch language, current ${lang === 'EN' ? 'English' : 'Japanese'}`}
            title="Switch language"
          >
            <span className={lang === 'EN' ? 'text-bone' : ''}>EN</span>
            <span className="text-steel/50 mx-1">/</span>
            <span className={lang === 'JP' ? 'text-bone' : ''}>日本語</span>
          </button>

          <button
            className="hidden sm:inline-flex items-center gap-2 text-steel hover:text-bone transition-colors px-3 py-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
            aria-label="Log in"
          >
            <UserIcon />
            <span className="font-[Archivo] text-[0.78rem] font-semibold uppercase tracking-[0.12em]">
              Login
            </span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="relative inline-flex items-center gap-2 text-bone px-3 py-2 rounded-sm hover:text-ember-hot transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
            aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-ember text-white text-[0.62rem] font-bold font-mono">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenu((m) => !m)}
            className="md:hidden text-bone p-2"
            aria-label="Toggle menu"
            aria-expanded={menu}
          >
            <span className="block w-6 h-px bg-current mb-1.5" />
            <span className="block w-6 h-px bg-current mb-1.5" />
            <span className="block w-4 h-px bg-current" />
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {menu && (
        <nav className="md:hidden bg-carbon/95 backdrop-blur-xl border-t border-white/10 px-5 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `py-3 font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] border-b border-white/5 ${
                  isActive ? 'text-ember-hot' : 'text-bone'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

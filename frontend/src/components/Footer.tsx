import { Link } from 'react-router-dom';
import SwingArc from './SwingArc';
import { useI18n } from '../i18n/LanguageContext';

const shafts = [
  'Darkness Shaft',
  'Blaze Shaft',
  'Darkness FW Shaft',
  'FLYZ FW Shaft',
  'Darkness HB Shaft',
  'FLYZ HB Shaft',
  'Pro Iron Shaft',
  'Air Iron Shaft',
  'Pro Stage 2 · T6–T10',
  'Circle Wedge',
];

export default function Footer() {
  const { t, lp } = useI18n();

  const company = [
    { label: t.footer.home, to: '/' },
    { label: t.footer.aboutUs, to: '/#about' },
    { label: t.footer.faq, to: '/faq' },
    { label: t.footer.products, to: '/shop' },
    { label: t.footer.contact, to: '/contact' },
    { label: t.footer.shipping, to: '/shipping-returns' },
    { label: t.footer.terms, to: '/terms-conditions' },
  ];

  return (
    <footer className="relative carbon-weave grain border-t border-white/10 overflow-hidden">
      {/* faint signature arc bleeding from the corner */}
      <div className="pointer-events-none absolute -right-24 -bottom-24 w-[420px] opacity-[0.12]">
        <SwingArc count={22} sweep={150} rotate={120} animate={false} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <img src="/kaen_logo.avif" alt="KAEN Performance Composite" className="h-8 w-auto mb-5" />
            <p className="text-steel text-sm max-w-xs leading-relaxed">
              {t.footer.blurb}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink href="https://www.facebook.com/kaengolf" label="Facebook">
                <path d="M14 8.5h2V6h-2c-1.7 0-3 1.3-3 3v1.5H9V13h2v5h2.5v-5H16l.5-2.5h-3V9c0-.3.2-.5.5-.5z" />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/kaengolf_jp/" label="Instagram">
                <>
                  <rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="15.8" cy="8.2" r="1" fill="currentColor" />
                </>
              </SocialLink>
              <SocialLink href="mailto:info@kaengolf.jp" label="Email us">
                <path
                  d="M5 7h14v10H5zM5 7l7 5 7-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </SocialLink>
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-steel mb-5">{t.footer.company}</h4>
            <ul className="space-y-3">
              {company.map((c) => (
                <li key={c.label}>
                  <Link
                    to={lp(c.to)}
                    className="text-bone/85 hover:text-ember-hot text-sm transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-steel mb-5">{t.footer.shaftLineup}</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {shafts.map((s) => (
                <li key={s}>
                  <Link
                    to={lp('/shop')}
                    className="text-bone/85 hover:text-ember-hot text-[0.8rem] transition-colors leading-snug block"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-7 border-t border-white/10 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <h4 className="eyebrow text-steel mb-2">{t.footer.ourLocation}</h4>
            <address className="not-italic text-bone/80 text-sm leading-relaxed max-w-sm">
              1-1-1 Minami Aoyama, Minato-ku
              <br />
              7F Shin-Aoyama Building East, Tokyo 107-0062
              <br />
              <a href="mailto:info@kaengolf.jp" className="text-ember-hot hover:text-ember transition-colors">
                info@kaengolf.jp
              </a>
            </address>
          </div>
          <div className="md:text-right">
            <p className="eyebrow text-steel/70">
              © {new Date().getFullYear()} KAEN Performance Composite
            </p>
            <p className="text-steel/60 text-xs mt-1">{t.footer.signature}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-10 h-10 grid place-items-center rounded-sm border border-white/12 text-steel hover:text-bone hover:border-ember transition-colors"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { subscribeToNewsletter } from '../lib/newsletter';

/**
 * KAEN newsletter popup — carbon & flame.
 *
 * Display rules (industry-standard, non-intrusive):
 *  - Shows once per visitor: after 15s dwell OR on exit-intent, whichever fires first.
 *  - Never interrupts conversion/auth flows (checkout, order-confirmation, login, register, account),
 *    in either the English or /ja locale.
 *  - Dismissed → suppressed 30 days. Subscribed → suppressed permanently.
 *  - Respects prefers-reduced-motion; closes on Esc / backdrop; locks body scroll while open.
 */

const STORAGE_KEY = 'kaen_newsletter';
const RESHOW_AFTER_MS = 30 * 24 * 60 * 60 * 1000;
const DWELL_MS = 15_000;
const SUPPRESSED = ['/checkout', '/order-confirmation', '/login', '/register', '/account'];

type Stored = { status: 'dismissed' | 'subscribed'; at: number };

function canonicalPath(): string {
  const p = window.location.pathname;
  if (p === '/ja') return '/';
  return p.startsWith('/ja/') ? p.slice(3) : p;
}

function shouldSuppress(): boolean {
  if (SUPPRESSED.some((s) => canonicalPath().startsWith(s))) return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw) as Stored;
    if (s.status === 'subscribed') return true;
    if (s.status === 'dismissed') return Date.now() - s.at < RESHOW_AFTER_MS;
  } catch {
    /* corrupt — treat as never seen */
  }
  return false;
}

export default function NewsletterModal() {
  const { t, lang } = useI18n();
  const n = t.newsletter;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldSuppress()) return;
    let fired = false;
    const reveal = () => {
      if (fired || shouldSuppress()) return;
      fired = true;
      setOpen(true);
      cleanup();
    };
    const timer = window.setTimeout(reveal, DWELL_MS);
    const onExit = (e: MouseEvent) => e.clientY <= 0 && reveal();
    const cleanup = () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onExit);
    };
    document.addEventListener('mouseout', onExit);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    emailRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function persist(status: Stored['status']) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, at: Date.now() }));
    } catch {
      /* best effort */
    }
  }

  function close() {
    if (state !== 'done') persist('dismissed');
    setOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;
    setState('sending');
    const ok = await subscribeToNewsletter({ name, email, source: 'kaen', locale: lang });
    if (ok) {
      persist('subscribed');
      setState('done');
    } else {
      setState('error');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kaen-nl-title"
    >
      <div
        className="nl-backdrop absolute inset-0 bg-carbon/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div className="nl-card carbon-weave relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-sm border border-white/10 shadow-float md:grid-cols-2">
        {/* image panel */}
        <div className="relative hidden min-h-[280px] md:block">
          <img
            src="/styles2/golf-product-excellence.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon/30 to-carbon" />
          <div className="absolute inset-0 bg-gradient-to-t from-ember/25 to-transparent mix-blend-multiply" />
          <span className="font-display absolute left-6 top-6 text-lg font-extrabold tracking-tighter text-bone">
            KAEN<span className="text-ember">.</span>
          </span>
        </div>

        {/* form panel */}
        <div className="relative bg-graphite/60 p-8 sm:p-10">
          <button
            onClick={close}
            className="absolute right-4 top-4 p-2 text-steel transition-colors hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
            aria-label={n.close}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {state === 'done' ? (
            <div className="flex min-h-[240px] flex-col justify-center text-center">
              <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-ember/50 text-ember">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-bone">
                {n.successTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-steel">{n.successBody}</p>
              <button onClick={() => setOpen(false)} className="btn-ember mt-6 justify-center self-center">
                {n.successCta}
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow text-ember">{n.eyebrow}</p>
              <h2
                id="kaen-nl-title"
                className="font-display mt-3 text-2xl font-extrabold leading-tight tracking-tighter text-bone"
              >
                {n.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-steel">{n.body}</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={n.namePlaceholder}
                  aria-label={n.namePlaceholder}
                  className="w-full rounded-sm border border-white/12 bg-carbon px-4 py-3 text-sm text-bone placeholder:text-steel focus:border-ember focus:outline-none"
                />
                <input
                  ref={emailRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={n.emailPlaceholder}
                  aria-label={n.emailPlaceholder}
                  className="w-full rounded-sm border border-white/12 bg-carbon px-4 py-3 text-sm text-bone placeholder:text-steel focus:border-ember focus:outline-none"
                />
                {state === 'error' && <p className="text-xs text-ember-hot">{n.error}</p>}
                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="btn-ember w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {state === 'sending' ? n.subscribing : n.subscribe}
                </button>
              </form>

              <p className="mt-4 text-[0.7rem] leading-relaxed text-steel">{n.consent}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

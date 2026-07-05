import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { STRINGS, type Lang, type Strings } from './strings';

interface I18nState {
  /** Active locale, derived from the URL (`/ja` prefix ⇒ Japanese). */
  lang: Lang;
  /** Strings for the active locale. */
  t: Strings;
  /**
   * Localize a canonical (English) internal path for the active locale.
   * `lp('/shop')` → `/shop` in EN, `/ja/shop` in JP. `lp('/')` → `/ja` in JP.
   */
  lp: (path: string) => string;
  /** The current page's path in the opposite locale (for the toggle). */
  altPath: string;
  /** The opposite locale, for labelling the toggle. */
  altLang: Lang;
}

const I18nContext = createContext<I18nState | null>(null);

const isJa = (pathname: string) => pathname === '/ja' || pathname.startsWith('/ja/');

/** Remove the `/ja` prefix, returning the canonical English path. */
const stripJa = (pathname: string) => {
  if (pathname === '/ja') return '/';
  if (pathname.startsWith('/ja/')) return pathname.slice(3);
  return pathname;
};

/** Add the `/ja` prefix to a canonical English path. */
const addJa = (pathname: string) => (pathname === '/' ? '/ja' : `/ja${pathname}`);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname, search, hash } = useLocation();

  const value = useMemo<I18nState>(() => {
    const lang: Lang = isJa(pathname) ? 'ja' : 'en';
    const canonical = stripJa(pathname);
    const altPathname = lang === 'ja' ? canonical : addJa(canonical);
    return {
      lang,
      t: STRINGS[lang],
      lp: (path: string) => (lang === 'ja' ? addJa(path) : path),
      altPath: `${altPathname}${search}${hash}`,
      altLang: lang === 'ja' ? 'en' : 'ja',
    };
  }, [pathname, search, hash]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}

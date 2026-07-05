import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { LEGACY_PAGES } from '../content/legacyPages';
import { useSeo } from '../lib/seo';
import Embers from '../components/Embers';

// Maps the route slug to the content key (route uses the old Wix slug, e.g.
// `copy-of-fairway-wood-series`; content is keyed by a clean name).
const SLUG_TO_KEY: Record<string, string> = {
  'new-arrivals': 'new-arrivals',
  'wood-shaft': 'wood-shaft',
  'darkness-fw-shaft': 'darkness-fw-shaft',
  backpacks: 'backpacks',
  'fairway-wood-series': 'fairway-wood-series',
};

// The canonical (English) route path this content is served at, for SEO.
const KEY_TO_PATH: Record<string, string> = {
  'new-arrivals': '/new-arrivals',
  'wood-shaft': '/wood-shaft',
  'darkness-fw-shaft': '/darkness-fw-shaft',
  backpacks: '/backpacks',
  'fairway-wood-series': '/copy-of-fairway-wood-series',
};

export default function LegacyPage({ slug }: { slug: string }) {
  const { lang, t, lp } = useI18n();
  const key = SLUG_TO_KEY[slug] ?? slug;
  const doc = LEGACY_PAGES[key]?.[lang];

  useSeo({
    title: doc?.title ?? 'KAEN',
    description: doc?.description ?? '',
    path: lp(KEY_TO_PATH[key] ?? `/${slug}`),
  });

  if (!doc) return null;

  return (
    <div className="bg-carbon min-h-screen">
      {/* hero */}
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={doc.heroImage || '/background/background1.avif'}
            alt=""
            className="ken-burns w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/55" />
        </div>
        <Embers count={12} className="opacity-70" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
          <p className="hero-anim eyebrow text-ember-hot mb-5" style={{ '--d': '0.05s' } as CSSProperties}>
            {doc.eyebrow}
          </p>
          <h1
            className="hero-cast display-hero text-bone text-[clamp(2.6rem,8vw,6rem)] mb-6"
            style={{ '--d': '0.15s' } as CSSProperties}
          >
            {doc.title}
          </h1>
          <p
            className="hero-anim text-bone/70 text-lg max-w-2xl leading-relaxed"
            style={{ '--d': '0.35s' } as CSSProperties}
          >
            {doc.lead}
          </p>
        </div>
      </section>

      {/* body */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-20">
          <article className="space-y-6">
            {doc.blocks.map((block, i) => {
              if (block.type === 'h2') {
                return (
                  <h2
                    key={i}
                    className="font-display text-bone text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tightest pt-8 first:pt-0 border-l-2 border-ember pl-4"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3 key={i} className="eyebrow text-ember-hot pt-4">
                    {block.text}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-bone/75 leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </article>

          {doc.figures && doc.figures.length > 0 && (
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {doc.figures.map((fig, i) => (
                <figure key={i} className={fig.wide ? 'col-span-2 lg:col-span-3' : ''}>
                  <div className="rounded-sm overflow-hidden border border-white/10 bg-carbon/60 grid place-items-center">
                    <img
                      src={fig.src}
                      alt={fig.caption || ''}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {fig.caption && <figcaption className="eyebrow text-steel mt-2">{fig.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap gap-6">
            <Link to={lp('/shop')} className="btn-ember">
              {t.common.goToShop}
            </Link>
            <Link
              to={lp('/learn')}
              className="link-sweep inline-flex items-center font-[Archivo] font-semibold text-ember-hot text-sm uppercase tracking-[0.12em]"
            >
              {t.nav.learn} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

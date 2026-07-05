import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { LEGAL_PAGES } from '../content/legalPages';
import { useSeo } from '../lib/seo';
import Embers from '../components/Embers';

export default function ContentPage({ slug }: { slug: keyof typeof LEGAL_PAGES }) {
  const { lang, t, lp } = useI18n();
  const doc = LEGAL_PAGES[slug][lang];

  useSeo({
    title: doc.title,
    description: doc.description,
    path: lp(`/${slug}`),
  });

  return (
    <div className="bg-carbon min-h-screen">
      {/* hero */}
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/background/background1.avif" alt="" className="ken-burns w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/90 to-carbon/70" />
        </div>
        <Embers count={10} className="opacity-60" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
          <p className="hero-anim eyebrow text-ember-hot mb-4" style={{ '--d': '0.05s' } as CSSProperties}>
            {doc.eyebrow}
          </p>
          <h1
            className="hero-cast display-hero text-bone text-[clamp(2.2rem,6vw,4rem)]"
            style={{ '--d': '0.15s' } as CSSProperties}
          >
            {doc.title}
          </h1>
        </div>
      </section>

      {/* body */}
      <section className="relative border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-20">
          <article className="space-y-6">
            {doc.blocks.map((block, i) => {
              if (block.type === 'h2') {
                return (
                  <h2
                    key={i}
                    className="font-display text-bone text-[clamp(1.4rem,3vw,2rem)] font-bold tracking-tightest pt-6 first:pt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'h3') {
                return (
                  <h3 key={i} className="eyebrow text-ember-hot pt-3">
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

          <div className="mt-14 pt-8 border-t border-white/10">
            <Link
              to={lp('/contact')}
              className="link-sweep inline-block font-[Archivo] font-semibold text-ember-hot text-sm uppercase tracking-[0.12em]"
            >
              {t.nav.contact} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

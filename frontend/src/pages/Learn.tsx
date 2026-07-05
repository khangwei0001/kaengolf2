import { Link } from 'react-router-dom';
import { useState, type CSSProperties } from 'react';
import { PRODUCTS, CATEGORY_LABEL, money, type Product } from '../data/products';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../i18n/LanguageContext';
import Embers from '../components/Embers';

interface LearnEntry {
  productId: string;
  images: string[];
  flagship?: boolean;
}

const LEARN: LearnEntry[] = [
  {
    productId: 'dagger-pro-2',
    flagship: true,
    images: [
      '/learn/dagger pro stage II 1.avif',
      '/learn/dagger pro stage II 2.avif',
      '/learn/dagger pro stage II 3.avif',
      '/learn/dagger pro stage II 4.avif',
    ],
  },
  { productId: 'darkness-driver', images: ['/learn/Darkness Driver Shaft.avif'] },
  { productId: 'blaze-driver', images: ['/learn/Blaze Driver Shaft 1.avif', '/learn/Blaze Driver Shaft 2.avif'] },
  { productId: 'darkness-fw', images: ['/learn/Darkness FW Shaft.avif'] },
  { productId: 'flyz-fw', images: ['/learn/FLYZ FW Shaft.avif'] },
  { productId: 'darkness-hb', images: ['/learn/Darkness HB Shaft.avif'] },
  { productId: 'flyz-hb', images: ['/learn/FLYZ HB Shaft.avif'] },
];

const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export default function Learn() {
  const { t, lp } = useI18n();
  useReveal();
  const flagship = LEARN.find((l) => l.flagship)!;
  const rest = LEARN.filter((l) => !l.flagship);

  return (
    <div className="bg-carbon">
      {/* hero */}
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/background/background1.avif" alt="" className="ken-burns w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/55" />
        </div>
        <Embers count={12} className="opacity-70" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
          <p className="hero-anim eyebrow text-ember-hot mb-5" style={{ '--d': '0.05s' } as CSSProperties}>
            {t.learn.eyebrow}
          </p>
          <h1
            className="hero-cast display-hero text-bone text-[clamp(2.6rem,8vw,6rem)] mb-5"
            style={{ '--d': '0.15s' } as CSSProperties}
          >
            {t.learn.title}
          </h1>
          <p
            className="hero-anim text-bone/70 text-lg max-w-2xl leading-relaxed"
            style={{ '--d': '0.35s' } as CSSProperties}
          >
            {t.learn.intro}
          </p>
        </div>
      </section>

      <Flagship entry={flagship} />

      <div className="bg-carbon">
        {rest.map((entry, i) => (
          <Feature key={entry.productId} entry={entry} flip={i % 2 === 1} />
        ))}
      </div>

      {/* tail CTA */}
      <section className="bg-ash text-carbon py-20 text-center">
        <p className="eyebrow text-ember-deep mb-4">{t.learn.readyToBuild}</p>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tightest mb-7">
          {t.learn.configureYourShaft}
        </h2>
        <Link to={lp('/shop')} className="btn-ember">
          {t.common.goToShop}
        </Link>
      </section>
    </div>
  );
}

function SpecChips({ product }: { product: Product }) {
  const top = product.specs.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-7 max-w-md">
      {top.map((s) => (
        <div key={s.label} className="border-l border-ember/50 pl-3">
          <p className="eyebrow text-steel">{s.label}</p>
          <p className="font-mono text-bone text-sm mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function Flagship({ entry }: { entry: LearnEntry }) {
  const { t, lp } = useI18n();
  const p = byId(entry.productId);
  const [active, setActive] = useState(0);
  return (
    <section className="carbon-weave grain py-20 sm:py-28 border-y border-white/10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="reveal">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 bg-steelplate">
            {entry.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${p.name} view ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            {entry.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`w-16 h-16 rounded-sm overflow-hidden border transition-all ${
                  i === active ? 'border-ember' : 'border-white/12 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="reveal">
          <p className="eyebrow text-ember-hot mb-4">{t.learn.flagship} · {CATEGORY_LABEL[p.category]}</p>
          <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-tightest leading-[0.98]">
            {p.name}
          </h2>
          <p className="text-bone/75 leading-relaxed mt-5">{p.description}</p>
          <SpecChips product={p} />
          <div className="flex items-center gap-5 mt-8">
            <Link to={lp('/shop')} className="btn-ember">
              {t.learn.configure} — {money(p.price)}
            </Link>
            <span className="font-mono text-steel text-xs">{p.tech.join(' · ')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ entry, flip }: { entry: LearnEntry; flip: boolean }) {
  const { t, lp } = useI18n();
  const p = byId(entry.productId);
  return (
    <section className="py-16 sm:py-24 border-b border-white/[0.06]">
      <div
        className={`mx-auto max-w-[1400px] px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
          flip ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="reveal group relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 bg-steelplate">
          <img
            src={entry.images[0]}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/40 to-transparent" />
        </div>
        <div className="reveal">
          <p className="eyebrow text-ember-hot mb-3">{CATEGORY_LABEL[p.category]}</p>
          <h3 className="font-display text-bone text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold tracking-tightest leading-tight">
            {p.name}
          </h3>
          <p className="text-bone/70 leading-relaxed mt-4 max-w-xl">{p.description}</p>
          <SpecChips product={p} />
          <Link
            to={lp('/shop')}
            className="link-sweep inline-block mt-7 font-[Archivo] font-semibold text-ember-hot text-sm uppercase tracking-[0.12em]"
          >
            {t.learn.configure} {p.name} →
          </Link>
        </div>
      </div>
    </section>
  );
}

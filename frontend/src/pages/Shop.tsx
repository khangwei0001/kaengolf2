import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  CATEGORIES,
  CATEGORY_LABEL,
  money,
  type Product,
  type CategoryKey,
} from '../data/products';
import { fetchProducts } from '../lib/medusa';
import { productPath } from '../lib/seo';
import { useCart } from '../store/CartContext';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../i18n/LanguageContext';
import Embers from '../components/Embers';

export default function Shop() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { add } = useCart();

  // Load this brand's live catalogue from the backend Store API.
  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.category === filter)),
    [filter, products],
  );

  useReveal([filter, products]);

  return (
    <div className="bg-carbon">
      {/* hero */}
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/background/background3.avif" alt="" className="ken-burns w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/60" />
        </div>
        <Embers count={12} className="opacity-70" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-28">
          <p className="hero-anim eyebrow text-ember-hot mb-5" style={{ '--d': '0.05s' } as CSSProperties}>
            {t.shop.eyebrow} · {products.length} {t.shop.shaftsWord}
          </p>
          <h1
            className="hero-cast display-hero text-bone text-[clamp(2.6rem,8vw,6rem)] mb-5"
            style={{ '--d': '0.15s' } as CSSProperties}
          >
            {t.shop.title}
          </h1>
          <p
            className="hero-anim text-bone/70 text-lg max-w-xl leading-relaxed"
            style={{ '--d': '0.35s' } as CSSProperties}
          >
            {t.shop.intro}
          </p>
        </div>
      </section>

      {/* filters */}
      <div className="sticky top-[72px] z-30 bg-carbon/90 backdrop-blur-xl border-y border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-4 flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => {
            const active = filter === c.key;
            const count =
              c.key === 'all'
                ? products.length
                : products.filter((p) => p.category === c.key).length;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                aria-pressed={active}
                className={`group inline-flex items-center gap-2 px-4 py-2 rounded-sm border text-[0.78rem] font-[Archivo] font-semibold uppercase tracking-[0.1em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember ${
                  active
                    ? 'bg-ember border-ember text-white shadow-ember'
                    : 'border-white/12 text-steel hover:text-bone hover:border-white/30'
                }`}
              >
                {c.label}
                <span className={`font-mono text-[0.62rem] ${active ? 'text-white/70' : 'text-steel/60'}`}>
                  {count.toString().padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* grid */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={() => setSelected(p)} onAdd={add} />
          ))}
        </div>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ----------------------------------------------------------- CARD */
function ProductCard({
  product,
  onOpen,
  onAdd,
}: {
  product: Product;
  onOpen: () => void;
  onAdd: ReturnType<typeof useCart>['add'];
}) {
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product, {
      Series: product.series[0],
      Length: product.lengths[0],
      Sleeve: product.sleeves[0],
      Grip: product.grips[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      onClick={onOpen}
      className="reveal group relative rounded-sm overflow-hidden border border-white/10 bg-graphite cursor-pointer transition-all duration-300 hover:border-white/25 hover:shadow-float"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen())}
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-steelplate">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-transparent opacity-60" />
        <span className="absolute top-3 left-3 eyebrow text-bone/90 bg-carbon/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
          {CATEGORY_LABEL[product.category]}
        </span>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {product.tech.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[0.58rem] text-ember-hot border border-ember/40 bg-carbon/50 px-1.5 py-0.5 rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* quick add */}
        <button
          onClick={quickAdd}
          className={`absolute bottom-3 right-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold font-[Archivo] uppercase tracking-[0.08em] transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember ${
            added ? 'bg-bone text-carbon' : 'bg-ember text-white'
          }`}
          aria-label={`Quick add ${product.name} to cart`}
        >
          {added ? t.shop.added : t.shop.add}
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-[Archivo] text-bone font-semibold leading-tight group-hover:text-ember-hot transition-colors">
            {product.name}
          </h3>
          <span className="font-mono text-bone text-sm shrink-0">{money(product.price)}</span>
        </div>
        <p className="text-steel text-sm mt-2 leading-snug line-clamp-2">{product.tagline}</p>
        <Link
          to={productPath(product)}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex mt-4 text-[0.72rem] font-[Archivo] font-semibold uppercase tracking-[0.12em] text-ember-hot hover:text-bone transition-colors"
        >
          {t.shop.productDetails}
        </Link>
      </div>
    </article>
  );
}

/* --------------------------------------------------------- MODAL */
function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { t, lp } = useI18n();
  const { add } = useCart();
  const [opts, setOpts] = useState<Record<string, string>>({
    Series: product.series[0],
    Length: product.lengths[0],
    Sleeve: product.sleeves[0],
    Grip: product.grips[0],
  });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const selects: { key: string; label: string; options: string[] }[] = [
    { key: 'Series', label: t.shop.series, options: product.series },
    { key: 'Length', label: t.shop.length, options: product.lengths },
    { key: 'Sleeve', label: t.shop.sleeve, options: product.sleeves },
    { key: 'Grip', label: t.shop.grip, options: product.grips },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-stretch sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="fixed inset-0 bg-carbon/80 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-[1040px] my-auto carbon-weave border border-white/12 rounded-sm overflow-hidden shadow-float">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 grid place-items-center rounded-sm bg-carbon/60 border border-white/12 text-steel hover:text-bone transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* image */}
          <div className="relative bg-steelplate min-h-[300px] md:min-h-full">
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon/50 to-transparent" />
            <span className="absolute top-4 left-4 eyebrow text-bone/90 bg-carbon/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              {CATEGORY_LABEL[product.category]}
            </span>
          </div>

          {/* config */}
          <div className="p-7 sm:p-9 max-h-[88vh] overflow-y-auto">
            <h2 className="font-display text-bone text-2xl sm:text-3xl font-bold tracking-tightest leading-tight">
              {product.name}
            </h2>
            <p className="font-mono text-ember-hot text-xl mt-2">{money(product.price)}</p>
            <p className="text-bone/70 text-sm leading-relaxed mt-4">{product.description}</p>

            {/* options */}
            <div className="grid grid-cols-2 gap-4 mt-7">
              {selects.map((s) => (
                <label key={s.key} className="block">
                  <span className="eyebrow text-steel mb-2 block">
                    {s.label}
                    <span className="text-ember"> *</span>
                  </span>
                  <div className="relative">
                    <select
                      value={opts[s.key]}
                      onChange={(e) => setOpts((o) => ({ ...o, [s.key]: e.target.value }))}
                      className="field appearance-none pr-9 cursor-pointer"
                    >
                      {s.options.map((o) => (
                        <option key={o} value={o} className="bg-graphite text-bone">
                          {o}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </label>
              ))}
            </div>

            {/* qty + add */}
            <div className="flex items-center gap-3 mt-7">
              <div className="flex items-center border border-white/12 rounded-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 grid place-items-center text-steel hover:text-bone"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-mono text-bone">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-11 grid place-items-center text-steel hover:text-bone"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="btn-ember flex-1 justify-center"
                onClick={() => {
                  add(product, opts, qty);
                  onClose();
                }}
              >
                {t.shop.addToBag} — {money(product.price * qty)}
              </button>
            </div>

            {/* spec table */}
            <div className="mt-9">
              <p className="eyebrow text-steel mb-3">{t.shop.specifications}</p>
              <div>
                {product.specs.map((sp) => (
                  <div key={sp.label} className="spec-row">
                    <span className="text-steel">{sp.label}</span>
                    <span className="text-bone">{sp.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-steel/60 text-xs mt-4 leading-relaxed">
                {t.shop.specNotePre}
                <Link to={lp('/faq')} className="text-ember-hot hover:underline">
                  {t.shop.specNoteLink}
                </Link>
                {t.shop.specNotePost}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

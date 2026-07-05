import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  CATEGORY_LABEL,
  money,
  type Product,
} from '../data/products';
import { fetchProducts } from '../lib/medusa';
import { findProductBySlug, productJsonLd, productPath, useSeo } from '../lib/seo';
import { useCart } from '../store/CartContext';

function ProductDetailContent({ product }: { product: Product }) {
  const { add } = useCart();
  const path = productPath(product);
  const selects: { key: string; label: string; options: string[] }[] = [
    { key: 'Series', label: 'Series', options: product.series },
    { key: 'Length', label: 'Length', options: product.lengths },
    { key: 'Sleeve', label: 'Sleeve', options: product.sleeves },
    { key: 'Grip', label: 'Grip', options: product.grips },
  ].filter((select) => select.options.length > 0);
  const [opts, setOpts] = useState<Record<string, string>>(() =>
    Object.fromEntries(selects.map((select) => [select.key, select.options[0]])),
  );

  useSeo({
    title: `${product.name} - KAEN Golf Shaft`,
    description: product.description.slice(0, 155),
    path,
    image: product.image,
    type: 'product',
    jsonLd: productJsonLd(product),
  });

  return (
    <article className="bg-carbon min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Link to="/shop" className="inline-flex text-sm font-semibold uppercase tracking-[0.12em] text-ember-hot hover:text-bone transition-colors mb-8">
          Back to shop
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)] gap-8 lg:gap-12 items-start">
          <div className="rounded-sm overflow-hidden border border-white/10 bg-steelplate">
            <img src={product.image} alt={product.name} className="w-full aspect-[4/5] object-cover" />
          </div>

          <div>
            <p className="eyebrow text-ember-hot mb-3">{CATEGORY_LABEL[product.category]}</p>
            <h1 className="font-display text-bone text-4xl sm:text-6xl font-bold leading-none tracking-tight">
              {product.name}
            </h1>
            <p className="font-mono text-ember-hot text-2xl mt-6">{money(product.price)}</p>
            <p className="text-bone/72 leading-relaxed mt-6">{product.description}</p>

            {product.specs.length > 0 && (
              <dl className="grid sm:grid-cols-2 gap-px border border-white/10 bg-white/10 mt-8 rounded-sm overflow-hidden">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="bg-graphite px-5 py-4">
                    <dt className="eyebrow text-steel">{spec.label}</dt>
                    <dd className="text-bone mt-1">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {selects.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {selects.map((select) => (
                  <label key={select.key} className="block">
                    <span className="eyebrow text-steel mb-2 block">{select.label}</span>
                    <div className="relative">
                      <select
                        value={opts[select.key]}
                        onChange={(e) => setOpts((current) => ({ ...current, [select.key]: e.target.value }))}
                        className="field appearance-none pr-9 cursor-pointer"
                      >
                        {select.options.map((option) => (
                          <option key={option} value={option} className="bg-graphite text-bone">
                            {option}
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
            )}

            <button
              onClick={() =>
                add(product, selects.length ? opts : undefined)
              }
              className="btn-ember mt-8"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params.handle || params.legacySlug;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const product = useMemo(() => findProductBySlug(products, slug), [products, slug]);

  if (loading) {
    return <div className="bg-carbon min-h-screen pt-32 text-center text-bone">Loading product...</div>;
  }

  if (params.legacySlug && product) {
    return <Navigate to={productPath(product)} replace />;
  }

  if (!product) {
    return (
      <div className="bg-carbon min-h-screen pt-32 px-6 text-center">
        <h1 className="font-display text-bone text-4xl font-bold">Product not found</h1>
        <p className="text-bone/65 mt-3">This KAEN product may have moved during the site migration.</p>
        <Link to="/shop" className="btn-ember mt-8 inline-flex">Browse shop</Link>
      </div>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}

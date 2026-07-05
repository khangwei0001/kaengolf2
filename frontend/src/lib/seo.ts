import { useEffect } from 'react';
import type { Product } from '../data/products';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.kaengolf.jp').replace(/\/$/, '');
const SITE_NAME = 'KAEN Performance Composite';
const CURRENCY = import.meta.env.VITE_STORE_CURRENCY || 'MYR';

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'product';
  jsonLd?: Record<string, unknown>;
};

const legacySlugMap: Record<string, string> = {
  'blaze-driver-shaft-スリーブ付き': 'blaze-driver-shaft',
  'flyz-hybrid-shaft-hb-series': 'flyz-hybrid-shaft-hb-series',
  'flyz-fairway-wood-shaft-fw-series-スリーブ付き': 'flyz-fairway-wood-shaft-fw-series',
  'dagger-air-iron-shaft-シャフト単体': 'dagger-air-iron-shaft',
  'kaen-model-d-premium-performance-shaft': 'kaen-model-d-premium-performance-shaft',
  'circle-wedge-shaft-シャフト単体': 'circle-wedge-shaft',
  'dagger-pro-stage-ii-t6-t7-t8-t9-t10-シャフト単体': 'dagger-pro-stage-ii-t6-t7-t8-t9-t10',
  'darkness-experience-model-fairway-wood-shaft-fw-series-スリーブ付き': 'darkness-experience-model-fairway-wood-shaft-fw-series',
  'dagger-pro-iron-shaft-シャフト単体': 'dagger-pro-iron-shaft',
  'darkness-experience-model-hybrid-shaft-シャフト単体': 'darkness-experience-model-hybrid-shaft',
};

const toSlug = (value: string) =>
  decodeURIComponent(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const withoutImportSuffix = (value: string) => value.replace(/-[a-f0-9]{6}$/i, '');

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) {
    el = selector.startsWith('link') ? document.createElement('link') : document.createElement('meta');
    for (const [key, value] of Object.entries(attrs)) {
      if (key !== 'content' && key !== 'href') el.setAttribute(key, value);
    }
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
};

export const productPath = (product: Product) => `/products/${encodeURIComponent(product.handle || product.id)}`;

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const absoluteImage = (image?: string) => {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteUrl(image);
};

export function findProductBySlug(products: Product[], rawSlug?: string) {
  if (!rawSlug) return undefined;
  const decoded = decodeURIComponent(rawSlug);
  const mapped = legacySlugMap[decoded] || decoded;
  const slug = toSlug(mapped);

  return products.find((product) => {
    const handle = product.handle || product.id;
    const candidates = [product.id, handle, withoutImportSuffix(handle), product.name];
    return candidates.some((candidate) => toSlug(candidate) === slug || toSlug(candidate).startsWith(`${slug}-`));
  });
}

export function productJsonLd(product: Product) {
  const path = productPath(product);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: absoluteImage(product.image),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'KAEN',
    },
    category: product.category,
    sku: product.handle || product.id,
    url: absoluteUrl(path),
    offers: {
      '@type': 'Offer',
      priceCurrency: CURRENCY,
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: absoluteUrl(path),
    },
  };
}

const canonicalOf = (path: string) => (path === '/ja' ? '/' : path.replace(/^\/ja\//, '/'));
const jaOf = (path: string) => (path === '/' ? '/ja' : `/ja${path}`);

export function useSeo({ title, description, path = '/', image, type = 'website', jsonLd }: SeoInput) {
  useEffect(() => {
    const fullTitle = title.includes('KAEN') ? title : `${title} | ${SITE_NAME}`;
    const url = absoluteUrl(path);
    const imageUrl = absoluteImage(image);
    const isJa = path === '/ja' || path.startsWith('/ja/');
    const enPath = canonicalOf(path);
    const jaPath = jaOf(enPath);

    document.title = fullTitle;
    document.documentElement.lang = isJa ? 'ja' : 'en';
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('link[rel="canonical"]', { rel: 'canonical', href: url });
    // Tell search engines each page has an English and a Japanese equivalent.
    upsertMeta('link[rel="alternate"][hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: absoluteUrl(enPath) });
    upsertMeta('link[rel="alternate"][hreflang="ja"]', { rel: 'alternate', hreflang: 'ja', href: absoluteUrl(jaPath) });
    upsertMeta('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: absoluteUrl(enPath) });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    if (imageUrl) upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' });

    let script = document.getElementById('structured-data') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else {
      script?.remove();
    }
  }, [description, image, jsonLd, path, title, type]);
}

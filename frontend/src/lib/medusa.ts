import type { Product, CategoryKey } from "../data/products";

// Connects this storefront to the shared golf backend (Medusa Store API).
const BACKEND =
  import.meta.env.VITE_MEDUSA_BACKEND_URL ||
  "https://api.157.245.202.230.sslip.io";
const KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";
const headers = { "x-publishable-api-key": KEY };

const stripHtml = (s?: string) =>
  (s || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

const toCategoryKey = (name: string): CategoryKey => {
  const n = (name || "").toLowerCase();
  if (n.includes("fairway")) return "fairway";
  if (n.includes("hybrid")) return "hybrid";
  if (n.includes("iron")) return "iron";
  if (n.includes("wedge")) return "wedge";
  return "driver";
};

async function getRegionId(): Promise<string | undefined> {
  try {
    const r = await fetch(`${BACKEND}/store/regions`, { headers });
    const { regions } = await r.json();
    return (regions || []).find((x: any) => x.currency_code === "myr")?.id || regions?.[0]?.id;
  } catch {
    return undefined;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const regionId = await getRegionId();
  // variants.* fields are needed so "Add to Cart" can resolve the concrete
  // variant_id for the option combination the shopper picked (cart line items
  // require a variant_id, not a product id).
  const fields =
    "id,title,handle,description,metadata,*images,*options,*options.values,*categories,*variants.calculated_price,variants.id,variants.title,variants.sku,variants.options.value,variants.options.option.title";
  const url = `${BACKEND}/store/products?limit=400${regionId ? `&region_id=${regionId}` : ""}&fields=${encodeURIComponent(fields)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`store/products ${res.status}`);
  const { products } = await res.json();

  return (products || []).map((p: any): Product => {
    const optVals = (title: string): string[] => {
      const o = (p.options || []).find(
        (x: any) => (x.title || "").toLowerCase() === title.toLowerCase()
      );
      return o ? (o.values || []).map((v: any) => v.value) : [];
    };
    const prices = (p.variants || [])
      .map((v: any) => v?.calculated_price?.calculated_amount)
      .filter((n: any) => typeof n === "number");
    const price = prices.length ? Math.min(...prices) : 0;
    const desc = stripHtml(p.description);
    const known = ["series", "length", "sleeve", "grip"];
    const specs = (p.options || [])
      .filter((o: any) => !known.includes((o.title || "").toLowerCase()))
      .map((o: any) => ({
        label: o.title,
        value: (o.values || []).map((v: any) => v.value).join(" / "),
      }))
      .filter((s: any) => s.value);

    return {
      id: p.id,
      handle: p.handle || p.id,
      name: p.title,
      category: toCategoryKey(p.categories?.[0]?.name || ""),
      price,
      image: p.images?.[0]?.url || "/product_images/product_image_1.avif",
      tagline: (desc.split(/[.!?]\s/)[0] || p.title).slice(0, 120),
      description: desc || p.title,
      series: optVals("Series"),
      lengths: optVals("Length"),
      sleeves: optVals("Sleeve"),
      grips: optVals("Grip"),
      specs,
      tech: [],
      sourceUrl: p.metadata?.source_url as string | undefined,
      variants: (p.variants || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        sku: v.sku ?? undefined,
        options: Object.fromEntries(
          (v.options || [])
            .filter((o: any) => o?.option?.title && o?.value)
            .map((o: any) => [o.option.title as string, o.value as string])
        ),
      })),
    };
  });
}

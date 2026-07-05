import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../data/products';
import {
  addLineItem,
  clearPersistedCartId,
  ensureCart,
  removeLineItem,
  resolveVariantId,
  retrieveCart,
  selectedOptionsText,
  updateLineItem,
  type MedusaCart,
} from '../lib/checkoutApi';

// The bag is a real Medusa cart on the shared golf backend (persisted via a
// cart id in localStorage) — prices/totals come from the Store API, not
// client-side math. The context keeps the same shape the UI already uses.

export interface CartLine {
  /** Cart line id — used for quantity updates / removal. */
  lineId: string;
  productId: string;
  variantId: string;
  name: string;
  /** Unit price in the cart currency (MYR). */
  price: number;
  image: string;
  /** Variant option summary, e.g. "Darkness 60 / 45.5\" / TaylorMade". */
  optionsText?: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  /** The raw Medusa cart (checkout reads totals/addresses from here). */
  cart: MedusaCart | null;
  open: boolean;
  count: number;
  subtotal: number;
  pending: boolean;
  error: string | null;
  add: (product: Product, options?: Record<string, string>, qty?: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  setQty: (lineId: string, qty: number) => Promise<void>;
  setOpen: (open: boolean) => void;
  /** Replace local state after checkout mutated the cart server-side. */
  syncCart: (cart: MedusaCart | null) => void;
  /** Drop the local cart reference (after a completed order). */
  forget: () => void;
}

const CartContext = createContext<CartState | null>(null);

function mapLines(cart: MedusaCart | null): CartLine[] {
  const items = [...(cart?.items ?? [])];
  items.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
  return items.map((i) => ({
    lineId: i.id,
    productId: i.product_id || '',
    variantId: i.variant_id || '',
    name: i.product_title || i.title,
    price: i.unit_price,
    image: i.thumbnail || '/product_images/product_image_1.avif',
    optionsText: selectedOptionsText(i),
    qty: i.quantity,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const cartRef = useRef<MedusaCart | null>(null);
  cartRef.current = cart;

  useEffect(() => {
    retrieveCart()
      .then((c) => c && setCart(c))
      .catch(() => {});
  }, []);

  const run = useCallback(async (work: () => Promise<void>) => {
    setPending((p) => p + 1);
    setError(null);
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update your bag.');
    } finally {
      setPending((p) => p - 1);
    }
  }, []);

  const add = useCallback(
    async (product: Product, options?: Record<string, string>, qty = 1) => {
      const variantId = resolveVariantId(product, options);
      if (!variantId) {
        setError('This product cannot be added to the bag right now.');
        setOpen(true);
        return;
      }
      await run(async () => {
        const current = cartRef.current ?? (await ensureCart());
        const metadata = options && Object.keys(options).length
          ? { selected_options: options }
          : undefined;
        setCart(await addLineItem(current.id, variantId, qty, metadata));
      });
      setOpen(true);
    },
    [run],
  );

  const remove = useCallback(
    async (lineId: string) => {
      if (!cartRef.current) return;
      await run(async () => {
        setCart(await removeLineItem(cartRef.current!.id, lineId));
      });
    },
    [run],
  );

  const setQty = useCallback(
    async (lineId: string, qty: number) => {
      if (!cartRef.current) return;
      await run(async () => {
        if (qty < 1) {
          setCart(await removeLineItem(cartRef.current!.id, lineId));
        } else {
          setCart(await updateLineItem(cartRef.current!.id, lineId, qty));
        }
      });
    },
    [run],
  );

  const syncCart = useCallback((next: MedusaCart | null) => setCart(next), []);

  const forget = useCallback(() => {
    clearPersistedCartId();
    setCart(null);
  }, []);

  const value = useMemo<CartState>(() => {
    const lines = mapLines(cart);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = cart?.item_subtotal ?? 0;
    return {
      lines,
      cart,
      open,
      count,
      subtotal,
      pending: pending > 0,
      error,
      add,
      remove,
      setQty,
      setOpen,
      syncCart,
      forget,
    };
  }, [cart, open, pending, error, add, remove, setQty, syncCart, forget]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

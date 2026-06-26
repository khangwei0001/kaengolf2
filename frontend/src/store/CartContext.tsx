import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

export interface CartLine {
  id: string;
  name: string;
  price: number;
  image: string;
  options: Record<string, string>;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void;
  remove: (id: string, options: Record<string, string>) => void;
  setQty: (id: string, options: Record<string, string>, qty: number) => void;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartState | null>(null);

// a line is unique by product id + its selected options
const keyFor = (id: string, options: Record<string, string>) =>
  id + '::' + JSON.stringify(options);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((line: Omit<CartLine, 'qty'>, qty = 1) => {
    setLines((prev) => {
      const k = keyFor(line.id, line.options);
      const existing = prev.find((l) => keyFor(l.id, l.options) === k);
      if (existing) {
        return prev.map((l) =>
          keyFor(l.id, l.options) === k ? { ...l, qty: l.qty + qty } : l,
        );
      }
      return [...prev, { ...line, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string, options: Record<string, string>) => {
    const k = keyFor(id, options);
    setLines((prev) => prev.filter((l) => keyFor(l.id, l.options) !== k));
  }, []);

  const setQty = useCallback(
    (id: string, options: Record<string, string>, qty: number) => {
      const k = keyFor(id, options);
      setLines((prev) =>
        prev
          .map((l) => (keyFor(l.id, l.options) === k ? { ...l, qty } : l))
          .filter((l) => l.qty > 0),
      );
    },
    [],
  );

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, open, count, subtotal, add, remove, setQty, setOpen };
  }, [lines, open, add, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

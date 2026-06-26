import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';

const money = (n: number) => '$' + n.toLocaleString('en-US');

export default function CartDrawer() {
  const { open, setOpen, lines, remove, setQty, subtotal, count } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-carbon/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 z-[61] h-full w-full max-w-[420px] carbon-weave border-l border-white/10 flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        <header className="flex items-center justify-between px-6 h-[72px] border-b border-white/10 shrink-0">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-bone text-sm font-bold uppercase tracking-[0.16em]">
              Your Bag
            </span>
            <span className="eyebrow text-steel">
              {count.toString().padStart(2, '0')}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-steel hover:text-bone transition-colors p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex-1 grid place-items-center px-8 text-center">
            <div>
              <p className="font-display text-bone text-lg font-bold uppercase tracking-tight mb-2">
                Your bag is empty
              </p>
              <p className="text-steel text-sm mb-6">
                Every shaft is built to a single, descending design. Find the one that matches your swing.
              </p>
              <Link to="/shop" onClick={() => setOpen(false)} className="btn-ember">
                Browse shafts
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {lines.map((l) => (
                <div key={l.id + JSON.stringify(l.options)} className="flex gap-4">
                  <div className="w-16 h-20 shrink-0 rounded-sm overflow-hidden bg-steelplate border border-white/10">
                    <img src={l.image} alt={l.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="font-[Archivo] text-bone text-sm font-semibold leading-tight">
                        {l.name}
                      </p>
                      <button
                        onClick={() => remove(l.id, l.options)}
                        className="text-steel hover:text-ember text-xs shrink-0"
                        aria-label={`Remove ${l.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="font-mono text-[0.68rem] text-steel mt-1 leading-relaxed">
                      {Object.entries(l.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('  ·  ')}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/12 rounded-sm">
                        <button
                          onClick={() => setQty(l.id, l.options, l.qty - 1)}
                          className="w-7 h-7 grid place-items-center text-steel hover:text-bone"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-mono text-xs text-bone">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.options, l.qty + 1)}
                          className="w-7 h-7 grid place-items-center text-steel hover:text-bone"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm text-bone">{money(l.price * l.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-white/10 px-6 py-5 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="eyebrow text-steel">Subtotal</span>
                <span className="font-display text-bone text-xl font-bold">{money(subtotal)}</span>
              </div>
              <p className="text-steel text-xs mb-4">
                Shipping &amp; duties calculated at checkout.
              </p>
              <button className="btn-ember w-full justify-center">Proceed to checkout</button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

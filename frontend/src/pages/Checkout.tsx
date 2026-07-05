import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe, type Stripe, type Appearance } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  addShippingMethod,
  applyPromoCode,
  attachCustomerToCart,
  completeCart,
  fmtMoney,
  initiatePaymentSession,
  lineTotal,
  listShippingOptions,
  removePromoCode,
  retrieveCart,
  saveConfirmation,
  savePendingCheckout,
  selectedOptionsText,
  snapshotFromCart,
  updateCart,
  STRIPE_PUBLISHABLE_KEY,
  type MedusaAddress,
  type MedusaCart,
  type PaymentSessionInfo,
  type ShippingOption,
} from '../lib/checkoutApi';
import { useCart } from '../store/CartContext';
import { useCustomer } from '../store/CustomerContext';
import * as customerApi from '../lib/customerApi';
import type { CustomerAddress } from '../lib/customerApi';
import { useI18n } from '../i18n/LanguageContext';
import type { Strings } from '../i18n/strings';
import { useSeo } from '../lib/seo';
import { MY_STATES } from '../lib/states';

/* ─────────────────────────── Constants ─────────────────────────── */

type Step = 'info' | 'shipping' | 'payment';
const STEP_ORDER: Step[] = ['info', 'shipping', 'payment'];

interface AddressForm {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
}

const emptyAddress = (): AddressForm => ({
  first_name: '', last_name: '', company: '', address_1: '', address_2: '',
  city: '', province: '', postal_code: '', phone: '',
});

const fromMedusaAddress = (a?: MedusaAddress | null): AddressForm => ({
  first_name: a?.first_name || '', last_name: a?.last_name || '',
  company: a?.company || '', address_1: a?.address_1 || '',
  address_2: a?.address_2 || '', city: a?.city || '',
  province: a?.province || '', postal_code: a?.postal_code || '',
  phone: a?.phone || '',
});

const fromCustomerAddress = (a: CustomerAddress): AddressForm => ({
  first_name: a.first_name || '', last_name: a.last_name || '',
  company: a.company || '', address_1: a.address_1 || '',
  address_2: a.address_2 || '', city: a.city || '',
  province: a.province || '', postal_code: a.postal_code || '',
  phone: a.phone || '',
});

const toMedusaAddress = (f: AddressForm): MedusaAddress => ({
  first_name: f.first_name.trim(), last_name: f.last_name.trim(),
  company: f.company.trim() || undefined, address_1: f.address_1.trim(),
  address_2: f.address_2.trim() || undefined, city: f.city.trim(),
  province: f.province, postal_code: f.postal_code.trim(),
  country_code: 'my', phone: f.phone.trim() || undefined,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateAddress(
  f: AddressForm,
  prefix: string,
  tc: Strings['checkout'],
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!f.first_name.trim()) errors[`${prefix}first_name`] = tc.errFirstName;
  if (!f.last_name.trim()) errors[`${prefix}last_name`] = tc.errLastName;
  if (!f.address_1.trim()) errors[`${prefix}address_1`] = tc.errAddress;
  if (!f.city.trim()) errors[`${prefix}city`] = tc.errCity;
  if (!f.province) errors[`${prefix}province`] = tc.errState;
  if (!/^\d{5}$/.test(f.postal_code.trim())) errors[`${prefix}postal_code`] = tc.errPostcode;
  return errors;
}

/* ─────────────────────────── Stripe setup ─────────────────────────── */

const stripeCache: Record<string, Promise<Stripe | null>> = {};
function getStripe(connectedAccountId: string) {
  if (!stripeCache[connectedAccountId]) {
    stripeCache[connectedAccountId] = loadStripe(STRIPE_PUBLISHABLE_KEY, {
      stripeAccount: connectedAccountId,
    });
  }
  return stripeCache[connectedAccountId];
}

const stripeAppearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#FF4D17',
    colorBackground: '#16181C',
    colorText: '#F5F5F2',
    colorTextSecondary: '#8A8D93',
    colorDanger: '#FF8A3D',
    fontFamily: '"Manrope", system-ui, sans-serif',
    borderRadius: '2px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(245,245,242,0.12)', boxShadow: 'none' },
    '.Input:focus': { border: '1px solid #FF4D17', boxShadow: '0 0 0 1px #FF4D17' },
    '.Label': {
      textTransform: 'uppercase', letterSpacing: '0.18em',
      fontSize: '10px', fontWeight: '500', color: '#8A8D93',
    },
    '.Tab': { border: '1px solid rgba(245,245,242,0.12)' },
  },
};

/* ─────────────────────────── Small UI atoms ─────────────────────────── */

const inputCls = (invalid?: boolean) =>
  `field w-full ${invalid ? '!border-ember-deep' : ''}`;

function Field({
  label, error, children, optional, optionalLabel,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  optionalLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-steel mb-2 block">
        {label}
        {optional && optionalLabel && (
          <span className="normal-case tracking-normal text-steel/60"> {optionalLabel}</span>
        )}
      </span>
      {children}
      {error && <span className="block text-ember-hot text-xs mt-1.5">{error}</span>}
    </label>
  );
}

function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel"
      width="14" height="14" viewBox="0 0 24 24" fill="none"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function SavedAddressPicker({
  label, newLabel, addresses, selectedId, onSelect, onNew,
}: {
  label: string;
  newLabel: string;
  addresses: CustomerAddress[];
  selectedId: string;
  onSelect: (a: CustomerAddress) => void;
  onNew: () => void;
}) {
  if (!addresses.length) return null;
  return (
    <div className="mb-5 space-y-2.5">
      <p className="eyebrow text-steel mb-2">{label}</p>
      {addresses.map((a) => (
        <label key={a.id}
          className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 cursor-pointer transition-colors ${selectedId === a.id ? 'border-ember bg-ember/10' : 'border-white/12 hover:border-white/30'}`}>
          <input type="radio" checked={selectedId === a.id} onChange={() => onSelect(a)} className="accent-[#FF4D17]" />
          <span className="text-sm">
            <span className="block font-[Archivo] font-semibold text-bone">{a.first_name} {a.last_name}</span>
            <span className="block font-mono text-[0.68rem] text-steel mt-0.5">
              {[a.address_1, a.city, a.postal_code].filter(Boolean).join(', ')}
            </span>
          </span>
        </label>
      ))}
      <label className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 cursor-pointer transition-colors ${selectedId === 'new' ? 'border-ember bg-ember/10' : 'border-white/12 hover:border-white/30'}`}>
        <input type="radio" checked={selectedId === 'new'} onChange={onNew} className="accent-[#FF4D17]" />
        <span className="text-sm font-[Archivo] font-semibold text-bone">{newLabel}</span>
      </label>
    </div>
  );
}

function AddressFields({
  form, setForm, errors, prefix, tc,
}: {
  form: AddressForm;
  setForm: (f: AddressForm) => void;
  errors: Record<string, string>;
  prefix: string;
  tc: Strings['checkout'];
}) {
  const set = (k: keyof AddressForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label={tc.firstName} error={errors[`${prefix}first_name`]}>
        <input className={inputCls(!!errors[`${prefix}first_name`])} value={form.first_name}
          onChange={set('first_name')} autoComplete="given-name" />
      </Field>
      <Field label={tc.lastName} error={errors[`${prefix}last_name`]}>
        <input className={inputCls(!!errors[`${prefix}last_name`])} value={form.last_name}
          onChange={set('last_name')} autoComplete="family-name" />
      </Field>
      <div className="sm:col-span-2">
        <Field label={tc.company} optional optionalLabel={tc.optional}>
          <input className={inputCls()} value={form.company} onChange={set('company')}
            autoComplete="organization" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={tc.address} error={errors[`${prefix}address_1`]}>
          <input className={inputCls(!!errors[`${prefix}address_1`])} value={form.address_1}
            onChange={set('address_1')} placeholder={tc.addressPlaceholder} autoComplete="address-line1" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label={tc.address2} optional optionalLabel={tc.optional}>
          <input className={inputCls()} value={form.address_2} onChange={set('address_2')}
            autoComplete="address-line2" />
        </Field>
      </div>
      <Field label={tc.city} error={errors[`${prefix}city`]}>
        <input className={inputCls(!!errors[`${prefix}city`])} value={form.city}
          onChange={set('city')} autoComplete="address-level2" />
      </Field>
      <Field label={tc.state} error={errors[`${prefix}province`]}>
        <span className="relative block">
          <select
            className={`${inputCls(!!errors[`${prefix}province`])} appearance-none pr-9 cursor-pointer`}
            value={form.province} onChange={set('province')} autoComplete="address-level1"
          >
            <option value="" className="bg-graphite text-bone">{tc.selectState}</option>
            {MY_STATES.map((s) => (
              <option key={s} value={s} className="bg-graphite text-bone">{s}</option>
            ))}
          </select>
          <SelectChevron />
        </span>
      </Field>
      <Field label={tc.postcode} error={errors[`${prefix}postal_code`]}>
        <input className={inputCls(!!errors[`${prefix}postal_code`])} value={form.postal_code}
          onChange={set('postal_code')} inputMode="numeric" maxLength={5} autoComplete="postal-code" />
      </Field>
      <Field label={tc.country}>
        <input className={`${inputCls()} opacity-60 cursor-not-allowed`} value={tc.malaysia} disabled />
      </Field>
      <div className="sm:col-span-2">
        <Field label={tc.phone} error={errors[`${prefix}phone`]}>
          <input className={inputCls(!!errors[`${prefix}phone`])} value={form.phone}
            onChange={set('phone')} placeholder="+60 12-345 6789" inputMode="tel" autoComplete="tel" />
        </Field>
      </div>
    </div>
  );
}

/* ─────────────────────────── Payment form ─────────────────────────── */

function PaymentForm({
  cart, returnUrl, tc, onCompleted, onError,
}: {
  cart: MedusaCart;
  returnUrl: string;
  tc: Strings['checkout'];
  onCompleted: (orderGroupId?: string, orderGroupTotal?: number) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    setPayError(null);
    // Snapshot the cart so the confirmation page can render for guests even
    // after an off-site redirect (FPX/GrabPay) — see checkoutApi.ts.
    savePendingCheckout(snapshotFromCart(cart));

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: 'if_required',
    });

    if (error) {
      setPayError(error.message || tc.payFailed);
      setSubmitting(false);
      return;
    }
    if (
      paymentIntent &&
      ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status)
    ) {
      try {
        const result = await completeCart(cart.id);
        if (result.type === 'order_group') {
          onCompleted(result.order_group.id, result.order_group.total);
        } else {
          onError(result.error?.message || tc.completeFailed);
        }
      } catch (e) {
        onError(e instanceof Error ? e.message : tc.completeFailed);
      }
    } else {
      setPayError(tc.payFailed);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <PaymentElement options={{ layout: 'tabs' }} />
      {payError && (
        <p className="text-ember-hot text-sm mt-4" role="alert">{payError}</p>
      )}
      <button
        onClick={handlePay}
        disabled={!stripe || submitting}
        className="btn-ember w-full justify-center mt-6 disabled:opacity-60 disabled:pointer-events-none"
      >
        {submitting ? (
          <><Spinner /> {tc.processing}</>
        ) : (
          <>{tc.pay} {fmtMoney(cart.total)}</>
        )}
      </button>
      <p className="text-center font-mono text-[0.68rem] text-steel mt-4">
        {tc.stripeNote}
      </p>
    </div>
  );
}

/* ─────────────────────────── Order summary ─────────────────────────── */

function OrderSummary({
  cart, busy, tc, onApplyPromo, onRemovePromo, promoError,
}: {
  cart: MedusaCart;
  busy: boolean;
  tc: Strings['checkout'];
  onApplyPromo: (code: string) => Promise<void>;
  onRemovePromo: (code: string) => Promise<void>;
  promoError: string | null;
}) {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const codes = (cart.promotions || []).filter((p) => p.code && !p.is_automatic);

  const apply = async () => {
    if (!code.trim() || applying) return;
    setApplying(true);
    await onApplyPromo(code.trim().toUpperCase());
    setApplying(false);
    setCode('');
  };

  const shippingSelected = (cart.shipping_methods?.length ?? 0) > 0;

  return (
    <aside className="carbon-weave border border-white/10 rounded-sm p-6 lg:sticky lg:top-24 shadow-card">
      <h2 className="font-display text-bone text-sm font-bold uppercase tracking-[0.16em] mb-5">
        {tc.orderSummary}
      </h2>

      <ul className="list-none m-0 p-0 space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="relative w-14 h-16 shrink-0 rounded-sm overflow-hidden bg-steelplate border border-white/10">
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              )}
              <span className="absolute top-0 right-0 bg-ember text-white text-[10px] font-bold font-mono min-w-[16px] h-4 px-1 rounded-bl-sm flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-[Archivo] text-bone text-sm font-semibold leading-snug truncate">
                {item.product_title || item.title}
              </p>
              {selectedOptionsText(item) && (
                <p className="font-mono text-[0.65rem] text-steel mt-0.5 truncate">{selectedOptionsText(item)}</p>
              )}
            </div>
            <span className="font-mono text-bone text-sm shrink-0">{fmtMoney(lineTotal(item))}</span>
          </li>
        ))}
      </ul>

      {/* Promo code */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={tc.promoPlaceholder}
            className="field flex-1"
          />
          <button
            onClick={apply}
            disabled={!code.trim() || applying || busy}
            className="px-4 py-2 border border-ember/50 text-ember-hot font-[Archivo] text-xs font-semibold tracking-[0.1em] uppercase rounded-sm hover:bg-ember/10 transition-colors disabled:opacity-50"
          >
            {applying ? '…' : tc.apply}
          </button>
        </div>
        {promoError && <p className="text-ember-hot text-xs mt-2">{promoError}</p>}
        {codes.length > 0 && (
          <ul className="flex flex-wrap gap-2 list-none m-0 p-0 mt-3">
            {codes.map((p) => (
              <li key={p.id} className="inline-flex items-center gap-1.5 border border-ember/50 bg-ember/10 text-ember-hot font-mono text-xs px-2.5 py-1 rounded-sm">
                {p.code}
                <button
                  onClick={() => onRemovePromo(p.code!)}
                  className="text-ember-hot/70 hover:text-ember-hot ml-0.5"
                  aria-label={`Remove code ${p.code}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Totals */}
      <dl className="mt-6 pt-5 border-t border-white/10 space-y-2.5 m-0">
        <div className="flex justify-between text-sm">
          <dt className="text-steel">{tc.subtotal}</dt>
          <dd className="font-mono text-bone m-0">{fmtMoney(cart.item_subtotal)}</dd>
        </div>
        {cart.discount_total > 0 && (
          <div className="flex justify-between text-sm">
            <dt className="text-steel">{tc.discount}</dt>
            <dd className="font-mono text-ember-hot m-0">− {fmtMoney(cart.discount_total)}</dd>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <dt className="text-steel">{tc.shipping}</dt>
          <dd className="font-mono text-bone m-0">
            {shippingSelected ? fmtMoney(cart.shipping_total) : tc.calculatedNext}
          </dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-steel">{tc.tax}</dt>
          <dd className="font-mono text-bone m-0">{fmtMoney(cart.tax_total)}</dd>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
          <dt className="eyebrow text-steel">{tc.total}</dt>
          <dd className="font-display text-bone text-2xl font-bold m-0">{fmtMoney(cart.total)}</dd>
        </div>
      </dl>

      <p className="font-mono text-[0.65rem] text-steel/70 mt-5 leading-relaxed">
        {tc.secureNote}
      </p>
    </aside>
  );
}

/* ─────────────────────────── Checkout page ─────────────────────────── */

export default function Checkout() {
  const navigate = useNavigate();
  const { t, lp, lang } = useI18n();
  const tc = t.checkout;
  const { syncCart, forget } = useCart();
  const { customer } = useCustomer();

  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('info');
  const [busy, setBusy] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Step 1 — contact + addresses
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [shipping, setShipping] = useState<AddressForm>(emptyAddress());
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress());
  const [orderNotes, setOrderNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Saved addresses (logged-in customers only)
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedShipId, setSelectedShipId] = useState('new');
  const [selectedBillId, setSelectedBillId] = useState('new');
  const attachedCustomerCartId = useRef<string | null>(null);

  // Step 2 — shipping method
  const [options, setOptions] = useState<ShippingOption[] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Step 3 — payment
  const [payment, setPayment] = useState<PaymentSessionInfo | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useSeo({
    title: `${tc.title} - KAEN Performance Composite`,
    description: 'Secure KAEN checkout. Cards, FPX and GrabPay accepted.',
    path: '/checkout',
  });

  const applyCart = (next: MedusaCart) => {
    setCart(next);
    syncCart(next);
  };

  // Load the cart and prefill from any previous attempt.
  useEffect(() => {
    retrieveCart()
      .then((c) => {
        if (c) {
          setCart(c);
          if (c.email) setEmail(c.email);
          if (c.shipping_address?.address_1) setShipping(fromMedusaAddress(c.shipping_address));
          if (c.billing_address?.address_1) {
            setBilling(fromMedusaAddress(c.billing_address));
            setBillingSame(false);
          }
        }
      })
      .catch(() => setStepError(tc.loadCartFailed))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logged-in customers: load the address book and prefill the contact email.
  useEffect(() => {
    if (!customer) {
      setSavedAddresses([]);
      return;
    }
    customerApi.listAddresses().then(setSavedAddresses).catch(() => {});
    setEmail((e) => e || customer.email);
  }, [customer]);

  // Associate the cart with the logged-in customer so the completed order
  // shows up under Account → Orders (guest carts otherwise stay unlinked).
  useEffect(() => {
    if (!customer || !cart || attachedCustomerCartId.current === cart.id) return;
    attachedCustomerCartId.current = cart.id;
    attachCustomerToCart(cart.id).catch(() => {});
  }, [customer, cart]);

  const chooseSavedAddress = (kind: 'ship' | 'bill', addr: CustomerAddress) => {
    const mapped = fromCustomerAddress(addr);
    if (kind === 'ship') {
      setShipping(mapped);
      setSelectedShipId(addr.id);
    } else {
      setBilling(mapped);
      setSelectedBillId(addr.id);
    }
  };

  /* ── Step 1 submit ── */
  const submitInfo = async () => {
    if (!cart || busy) return;
    const nextErrors: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = tc.errEmail;
    if (!shipping.phone.trim()) nextErrors['ship_phone'] = tc.errPhone;
    Object.assign(nextErrors, validateAddress(shipping, 'ship_', tc));
    if (!billingSame) Object.assign(nextErrors, validateAddress(billing, 'bill_', tc));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    setStepError(null);
    try {
      const shippingAddress = toMedusaAddress(shipping);
      const updated = await updateCart(cart.id, {
        email: email.trim(),
        shipping_address: shippingAddress,
        billing_address: billingSame ? shippingAddress : toMedusaAddress(billing),
        metadata: {
          newsletter_opt_in: newsletter,
          ...(orderNotes.trim() ? { order_notes: orderNotes.trim() } : {}),
        },
      });
      applyCart(updated);
      setStep('shipping');
      window.scrollTo({ top: 0 });
    } catch (e) {
      setStepError(e instanceof Error ? e.message : tc.loadCartFailed);
    } finally {
      setBusy(false);
    }
  };

  /* ── Step 2: load options when entering ── */
  useEffect(() => {
    if (step !== 'shipping' || !cart || options) return;
    listShippingOptions(cart.id)
      .then((opts) => {
        setOptions(opts);
        const current = cart.shipping_methods?.[0]?.shipping_option_id;
        setSelectedOption(current || opts[0]?.id || null);
      })
      .catch((e) => setStepError(e instanceof Error ? e.message : tc.loadCartFailed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, cart, options]);

  const submitShipping = async () => {
    if (!cart || !selectedOption || busy) return;
    setBusy(true);
    setStepError(null);
    try {
      const updated = await addShippingMethod(cart.id, selectedOption);
      applyCart(updated);
      setPayment(null); // totals changed → session must be (re)created
      setStep('payment');
      window.scrollTo({ top: 0 });
    } catch (e) {
      setStepError(e instanceof Error ? e.message : tc.loadCartFailed);
    } finally {
      setBusy(false);
    }
  };

  /* ── Step 3: initiate the Stripe session when entering / after total changes ── */
  useEffect(() => {
    if (step !== 'payment' || !cart || payment || paymentLoading) return;
    if (!STRIPE_PUBLISHABLE_KEY) {
      setStepError('Payment is not configured (missing Stripe publishable key).');
      return;
    }
    setPaymentLoading(true);
    setStepError(null);
    initiatePaymentSession(cart.id)
      .then(setPayment)
      .catch((e) => setStepError(e instanceof Error ? e.message : tc.loadCartFailed))
      .finally(() => setPaymentLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, cart?.id, cart?.total, payment]);

  /* ── Promotions ── */
  const handleApplyPromo = async (codeInput: string) => {
    if (!cart) return;
    setPromoError(null);
    try {
      const updated = await applyPromoCode(cart.id, codeInput);
      const applied = (updated.promotions || []).some(
        (p) => p.code?.toUpperCase() === codeInput.toUpperCase(),
      );
      applyCart(updated);
      if (!applied) {
        setPromoError(tc.promoInvalid);
      } else if (step === 'payment') {
        setPayment(null); // total changed → recreate the payment session
      }
    } catch (e) {
      setPromoError(e instanceof Error ? e.message : tc.promoInvalid);
    }
  };

  const handleRemovePromo = async (codeInput: string) => {
    if (!cart) return;
    setPromoError(null);
    try {
      const updated = await removePromoCode(cart.id, codeInput);
      applyCart(updated);
      if (step === 'payment') setPayment(null);
    } catch (e) {
      setPromoError(e instanceof Error ? e.message : tc.promoInvalid);
    }
  };

  /* ── Completion ── */
  const handleCompleted = (orderGroupId?: string, orderGroupTotal?: number) => {
    if (cart) {
      saveConfirmation({
        ...snapshotFromCart(cart),
        orderGroupId,
        orderGroupTotal,
        completedAt: new Date().toISOString(),
      });
    }
    forget();
    navigate(`${lp('/order-confirmation')}?cart_id=${cart?.id ?? ''}`);
  };

  /* ─────────────────────────── Render ─────────────────────────── */

  if (loading) {
    return (
      <div className="bg-carbon min-h-screen pt-44 text-center">
        <Spinner className="inline-block text-ember" />
        <p className="mt-4 font-display text-bone/50 text-xl uppercase tracking-tight">{tc.preparing}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-carbon min-h-screen pt-44 px-6 text-center">
        <h1 className="font-display text-bone text-4xl font-bold">{tc.emptyTitle}</h1>
        <p className="text-steel mt-3">{tc.emptyBody}</p>
        <Link to={lp('/shop')} className="btn-ember mt-8 inline-flex">{tc.browseShop}</Link>
      </div>
    );
  }

  const stepIndex = STEP_ORDER.indexOf(step);
  const stepsMeta: { key: Step; label: string }[] = [
    { key: 'info', label: tc.stepInfo },
    { key: 'shipping', label: tc.stepShipping },
    { key: 'payment', label: tc.stepPayment },
  ];

  const shipSummary = [
    shipping.address_1, shipping.address_2, shipping.city,
    shipping.province, shipping.postal_code, tc.malaysia,
  ].filter(Boolean).join(', ');

  const returnUrl = `${window.location.origin}${lp('/order-confirmation')}?cart_id=${cart.id}`;

  return (
    <div className="bg-carbon min-h-screen pt-[72px] pb-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* Header */}
        <div className="pt-10 pb-8">
          <Link to={lp('/shop')} className="inline-flex text-sm font-semibold uppercase tracking-[0.12em] text-ember-hot hover:text-bone transition-colors">
            ← {tc.continueShopping}
          </Link>
          <h1 className="display-hero text-bone text-[clamp(2.4rem,6vw,4.5rem)] mt-4">
            {tc.title}
          </h1>

          {/* Stepper */}
          <ol className="flex items-center gap-2 sm:gap-3 mt-7 list-none m-0 p-0 flex-wrap">
            {stepsMeta.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <li key={s.key} className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => done && setStep(s.key)}
                    disabled={!done}
                    className={`flex items-center gap-2 font-[Archivo] text-[0.72rem] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      active ? 'text-ember-hot' : done ? 'text-bone hover:text-ember-hot' : 'text-steel/50'
                    } ${done ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`w-6 h-6 rounded-full border font-mono text-[11px] flex items-center justify-center ${
                      active ? 'border-ember bg-ember text-white' : done ? 'border-ember text-ember-hot' : 'border-white/20'
                    }`}>
                      {done ? '✓' : i + 1}
                    </span>
                    {s.label}
                  </button>
                  {i < stepsMeta.length - 1 && <span className="w-8 sm:w-12 h-px bg-white/15" />}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
          {/* ── Left: steps ── */}
          <div className="space-y-5 min-w-0">
            {stepError && (
              <div className="border border-ember/50 bg-ember/10 text-ember-hot text-sm rounded-sm px-4 py-3" role="alert">
                {stepError}
              </div>
            )}

            {/* Completed-step recaps */}
            {stepIndex > 0 && (
              <div className="bg-graphite border border-white/10 rounded-sm divide-y divide-white/10">
                <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0 text-sm">
                    <span className="eyebrow text-steel mr-3">{tc.recapContact}</span>
                    <span className="text-bone">{email}</span>
                  </div>
                  <button onClick={() => setStep('info')} className="font-[Archivo] text-[0.7rem] font-semibold text-ember-hot hover:text-bone uppercase tracking-[0.12em] shrink-0">
                    {tc.change}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0 text-sm">
                    <span className="eyebrow text-steel mr-3">{tc.recapShipTo}</span>
                    <span className="text-bone">{shipSummary}</span>
                  </div>
                  <button onClick={() => setStep('info')} className="font-[Archivo] text-[0.7rem] font-semibold text-ember-hot hover:text-bone uppercase tracking-[0.12em] shrink-0">
                    {tc.change}
                  </button>
                </div>
                {stepIndex > 1 && cart.shipping_methods?.[0] && (
                  <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0 text-sm">
                      <span className="eyebrow text-steel mr-3">{tc.recapMethod}</span>
                      <span className="text-bone">
                        {cart.shipping_methods[0].name} · {fmtMoney(cart.shipping_methods[0].amount)}
                      </span>
                    </div>
                    <button onClick={() => setStep('shipping')} className="font-[Archivo] text-[0.7rem] font-semibold text-ember-hot hover:text-bone uppercase tracking-[0.12em] shrink-0">
                      {tc.change}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 1 — Information */}
            {step === 'info' && (
              <div className="bg-graphite border border-white/10 rounded-sm p-6 sm:p-8">
                <h2 className="font-display text-bone text-xl font-bold uppercase tracking-tight mb-5">{tc.contact}</h2>
                <div className="grid gap-4">
                  <Field label={tc.email} error={errors.email}>
                    <input
                      type="email" className={inputCls(!!errors.email)} value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tc.emailPlaceholder} autoComplete="email"
                    />
                  </Field>
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox" checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="w-4 h-4 accent-[#FF4D17]"
                    />
                    <span className="text-sm text-steel">{tc.newsletter}</span>
                  </label>
                </div>

                <h2 className="font-display text-bone text-xl font-bold uppercase tracking-tight mt-9 mb-2">{tc.shippingAddress}</h2>
                <p className="font-mono text-[0.68rem] text-steel mb-5">{tc.malaysiaOnly}</p>
                <SavedAddressPicker
                  label={tc.savedShippingLabel}
                  newLabel={tc.newAddressOption}
                  addresses={savedAddresses}
                  selectedId={selectedShipId}
                  onSelect={(a) => chooseSavedAddress('ship', a)}
                  onNew={() => { setSelectedShipId('new'); setShipping(emptyAddress()); }}
                />
                <AddressFields form={shipping} setForm={setShipping} errors={errors} prefix="ship_" tc={tc} />

                <h2 className="font-display text-bone text-xl font-bold uppercase tracking-tight mt-9 mb-4">{tc.billingAddress}</h2>
                <div className="space-y-2.5">
                  <label className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 cursor-pointer transition-colors ${billingSame ? 'border-ember bg-ember/10' : 'border-white/12 hover:border-white/30'}`}>
                    <input type="radio" name="billing" checked={billingSame}
                      onChange={() => setBillingSame(true)} className="accent-[#FF4D17]" />
                    <span className="text-sm font-medium text-bone">{tc.billingSame}</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-sm px-4 py-3.5 cursor-pointer transition-colors ${!billingSame ? 'border-ember bg-ember/10' : 'border-white/12 hover:border-white/30'}`}>
                    <input type="radio" name="billing" checked={!billingSame}
                      onChange={() => setBillingSame(false)} className="accent-[#FF4D17]" />
                    <span className="text-sm font-medium text-bone">{tc.billingDifferent}</span>
                  </label>
                </div>
                {!billingSame && (
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <SavedAddressPicker
                      label={tc.savedBillingLabel}
                      newLabel={tc.newAddressOption}
                      addresses={savedAddresses}
                      selectedId={selectedBillId}
                      onSelect={(a) => chooseSavedAddress('bill', a)}
                      onNew={() => { setSelectedBillId('new'); setBilling(emptyAddress()); }}
                    />
                    <AddressFields form={billing} setForm={setBilling} errors={errors} prefix="bill_" tc={tc} />
                  </div>
                )}

                <div className="mt-9">
                  <Field label={tc.orderNotes} optional optionalLabel={tc.optional}>
                    <textarea
                      className={`${inputCls()} min-h-[80px] resize-y`} value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={tc.orderNotesPlaceholder}
                    />
                  </Field>
                </div>

                <button onClick={submitInfo} disabled={busy}
                  className="btn-ember w-full justify-center mt-8 disabled:opacity-60 disabled:pointer-events-none">
                  {busy && <Spinner />}
                  {tc.continueToShipping}
                </button>
              </div>
            )}

            {/* Step 2 — Shipping method */}
            {step === 'shipping' && (
              <div className="bg-graphite border border-white/10 rounded-sm p-6 sm:p-8">
                <h2 className="font-display text-bone text-xl font-bold uppercase tracking-tight mb-5">{tc.deliveryMethod}</h2>
                {!options ? (
                  <p className="text-steel text-sm py-6 text-center">
                    <Spinner className="inline-block mr-2 text-ember" />
                    {tc.loadingDelivery}
                  </p>
                ) : options.length === 0 ? (
                  <p className="text-steel text-sm">{tc.noDelivery}</p>
                ) : (
                  <div className="space-y-3">
                    {options.map((opt) => {
                      const express = /express/i.test(opt.name);
                      return (
                        <label key={opt.id}
                          className={`flex items-center gap-4 border rounded-sm px-4 py-4 cursor-pointer transition-colors ${
                            selectedOption === opt.id ? 'border-ember bg-ember/10' : 'border-white/12 hover:border-white/30'
                          }`}>
                          <input type="radio" name="shipping-option" checked={selectedOption === opt.id}
                            onChange={() => setSelectedOption(opt.id)} className="accent-[#FF4D17]" />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-bone font-[Archivo]">{opt.name}</span>
                            <span className="block font-mono text-[0.68rem] text-steel mt-0.5">
                              {express ? tc.expressEta : tc.standardEta}
                            </span>
                          </span>
                          <span className="font-mono text-bone">{fmtMoney(opt.amount)}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 mt-8">
                  <button onClick={() => setStep('info')}
                    className="text-sm font-semibold uppercase tracking-[0.12em] text-steel hover:text-bone transition-colors">
                    ← {tc.back}
                  </button>
                  <button onClick={submitShipping} disabled={busy || !selectedOption}
                    className="btn-ember disabled:opacity-60 disabled:pointer-events-none">
                    {busy && <Spinner />}
                    {tc.continueToPayment}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Payment */}
            {step === 'payment' && (
              <div className="bg-graphite border border-white/10 rounded-sm p-6 sm:p-8">
                <h2 className="font-display text-bone text-xl font-bold uppercase tracking-tight mb-1">{tc.payment}</h2>
                <p className="font-mono text-[0.68rem] text-steel mb-6">{tc.paymentNote}</p>
                {paymentLoading || !payment ? (
                  <p className="text-steel text-sm py-8 text-center">
                    <Spinner className="inline-block mr-2 text-ember" />
                    {tc.preparingPayment}
                  </p>
                ) : (
                  <Elements
                    key={payment.clientSecret}
                    stripe={getStripe(payment.connectedAccountId)}
                    options={{
                      clientSecret: payment.clientSecret,
                      appearance: stripeAppearance,
                      locale: lang,
                      fonts: [{
                        cssSrc: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap',
                      }],
                    }}
                  >
                    <PaymentForm
                      cart={cart}
                      returnUrl={returnUrl}
                      tc={tc}
                      onCompleted={handleCompleted}
                      onError={setStepError}
                    />
                  </Elements>
                )}
                <button onClick={() => setStep('shipping')}
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-steel hover:text-bone transition-colors mt-6">
                  ← {tc.backToShipping}
                </button>
              </div>
            )}
          </div>

          {/* ── Right: order summary ── */}
          <OrderSummary
            cart={cart}
            busy={busy}
            tc={tc}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            promoError={promoError}
          />
        </div>
      </div>
    </div>
  );
}

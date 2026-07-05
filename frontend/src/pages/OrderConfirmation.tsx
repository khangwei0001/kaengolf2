import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  completeCart,
  fmtMoney,
  loadConfirmation,
  loadPendingCheckout,
  saveConfirmation,
  type CheckoutSnapshot,
} from '../lib/checkoutApi';
import { useCart } from '../store/CartContext';
import { useI18n } from '../i18n/LanguageContext';
import { useSeo } from '../lib/seo';

type Status = 'working' | 'success' | 'failed' | 'unknown';

// Dedupe completion calls (React StrictMode double-runs effects in dev, and
// completing an already-completed cart would surface a spurious error).
const completions = new Map<string, ReturnType<typeof completeCart>>();
function completeOnce(cartId: string) {
  let p = completions.get(cartId);
  if (!p) {
    p = completeCart(cartId);
    completions.set(cartId, p);
    p.catch(() => completions.delete(cartId));
  }
  return p;
}

/**
 * Order confirmation. Reached two ways:
 *  1. Directly after an in-page card payment (checkout already completed the
 *     cart and stored the confirmation snapshot).
 *  2. Via Stripe's return_url after an off-site redirect (FPX/GrabPay) — in
 *     that case the cart still needs to be completed here.
 * Details render from the client-side snapshot because Mercur's complete
 * endpoint only returns the order_group id/total and the order-group detail
 * route requires an authenticated customer (guest checkout).
 */
export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const cartId = params.get('cart_id');
  const redirectStatus = params.get('redirect_status');
  const { t, lp } = useI18n();
  const tf = t.confirmation;
  const { forget } = useCart();
  const [status, setStatus] = useState<Status>('working');
  const [snapshot, setSnapshot] = useState<CheckoutSnapshot | null>(null);
  const [failMessage, setFailMessage] = useState<string | null>(null);

  useSeo({
    title: `${tf.confirmedEyebrow} - KAEN Performance Composite`,
    description: 'KAEN order confirmation.',
    path: '/order-confirmation',
  });

  useEffect(() => {
    // Already completed (in-page card flow, or a refresh of this page).
    const confirmed = loadConfirmation(cartId);
    if (confirmed) {
      setSnapshot(confirmed);
      setStatus('success');
      return;
    }

    if (!cartId) {
      setStatus('unknown');
      return;
    }

    if (redirectStatus === 'failed') {
      setFailMessage(tf.notCharged);
      setStatus('failed');
      return;
    }

    // Redirect return (FPX/GrabPay) — the cart still needs completing.
    const pending = loadPendingCheckout(cartId);
    completeOnce(cartId)
      .then((result) => {
        if (result.type === 'order_group') {
          const snap: CheckoutSnapshot = {
            ...(pending ?? {
              cartId,
              items: [],
              subtotal: 0,
              discountTotal: 0,
              shippingTotal: 0,
              taxTotal: 0,
              total: result.order_group.total ?? 0,
              currencyCode: 'myr',
            }),
            orderGroupId: result.order_group.id,
            orderGroupTotal: result.order_group.total,
            completedAt: new Date().toISOString(),
          };
          saveConfirmation(snap);
          forget();
          setSnapshot(snap);
          setStatus('success');
        } else {
          setFailMessage(result.error?.message || tf.failedDefault);
          setStatus('failed');
        }
      })
      .catch((e) => {
        setFailMessage(e instanceof Error ? e.message : tf.failedDefault);
        setStatus('failed');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, redirectStatus]);

  if (status === 'working') {
    return (
      <div className="bg-carbon min-h-screen pt-48 text-center">
        <p className="font-display text-bone/60 text-2xl uppercase tracking-tight">{tf.finalising}</p>
        <p className="font-mono text-steel text-xs mt-3">{tf.dontClose}</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-carbon min-h-screen pt-44 px-6 text-center">
        <h1 className="font-display text-bone text-4xl font-bold">{tf.failedTitle}</h1>
        <p className="text-steel mt-4 max-w-md mx-auto">{failMessage}</p>
        <p className="font-mono text-steel/70 text-xs mt-2">{tf.cartKept}</p>
        <Link to={lp('/checkout')} className="btn-ember mt-8 inline-flex">{tf.returnToCheckout}</Link>
      </div>
    );
  }

  if (status === 'unknown' || !snapshot) {
    return (
      <div className="bg-carbon min-h-screen pt-44 px-6 text-center">
        <h1 className="font-display text-bone text-4xl font-bold">{tf.noOrderTitle}</h1>
        <p className="text-steel mt-3">{tf.noOrderBody}</p>
        <Link to={lp('/shop')} className="btn-ember mt-8 inline-flex">{tf.continueShopping}</Link>
      </div>
    );
  }

  const shortRef = snapshot.orderGroupId
    ? snapshot.orderGroupId.replace(/^ordgrp_/, '').slice(-8).toUpperCase()
    : null;
  const addr = snapshot.shippingAddress;

  return (
    <div className="bg-carbon min-h-screen pt-[72px] pb-24">
      <div className="mx-auto max-w-[780px] px-5 sm:px-8 pt-14">
        {/* Success header */}
        <div className="text-center">
          <span className="inline-flex w-14 h-14 rounded-full border border-ember items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12.5l5 5L20 6.5" stroke="#FF4D17" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="eyebrow text-ember-hot mt-6">{tf.confirmedEyebrow}</p>
          <h1 className="display-hero text-bone text-[clamp(2.4rem,6vw,4rem)] mt-3">
            {tf.thankYou}
          </h1>
          <p className="text-bone/70 mt-5 max-w-lg mx-auto leading-relaxed">
            {tf.bodyPre}
            {shortRef && (
              <>
                {' '}{tf.refPre}
                <span className="font-mono text-ember-hot">#{shortRef}</span>
                {tf.refPost}
              </>
            )}
          </p>
          {snapshot.email && (
            <p className="font-mono text-[0.72rem] text-steel mt-3">
              {tf.orderedAs}: <span className="text-bone">{snapshot.email}</span>
            </p>
          )}
        </div>

        {/* Order details */}
        <div className="carbon-weave border border-white/10 rounded-sm mt-12 overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-display text-bone text-sm font-bold uppercase tracking-[0.16em] m-0">
              {tf.orderDetails}
            </h2>
          </div>

          {snapshot.items.length > 0 && (
            <ul className="list-none m-0 p-0 divide-y divide-white/10">
              {snapshot.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 px-6 py-4">
                  {item.thumbnail && (
                    <div className="w-14 h-16 shrink-0 bg-steelplate border border-white/10 rounded-sm overflow-hidden">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-[Archivo] text-bone font-semibold text-sm truncate">{item.title}</p>
                    {item.variantTitle && (
                      <p className="font-mono text-[0.65rem] text-steel mt-0.5 truncate">{item.variantTitle}</p>
                    )}
                    <p className="font-mono text-[0.65rem] text-steel mt-0.5">
                      {t.checkout.qty} {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-bone text-sm shrink-0">{fmtMoney(item.total)}</span>
                </li>
              ))}
            </ul>
          )}

          <dl className="px-6 py-5 border-t border-white/10 space-y-2 m-0 bg-carbon/40">
            <div className="flex justify-between text-sm">
              <dt className="text-steel">{t.checkout.subtotal}</dt>
              <dd className="font-mono text-bone m-0">{fmtMoney(snapshot.subtotal)}</dd>
            </div>
            {snapshot.discountTotal > 0 && (
              <div className="flex justify-between text-sm">
                <dt className="text-steel">
                  {t.checkout.discount}
                  {snapshot.promoCodes?.length ? ` (${snapshot.promoCodes.join(', ')})` : ''}
                </dt>
                <dd className="font-mono text-ember-hot m-0">− {fmtMoney(snapshot.discountTotal)}</dd>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <dt className="text-steel">
                {t.checkout.shipping}
                {snapshot.shippingMethod ? ` · ${snapshot.shippingMethod}` : ''}
              </dt>
              <dd className="font-mono text-bone m-0">{fmtMoney(snapshot.shippingTotal)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-steel">{t.checkout.tax}</dt>
              <dd className="font-mono text-bone m-0">{fmtMoney(snapshot.taxTotal)}</dd>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
              <dt className="eyebrow text-steel">{tf.totalPaid}</dt>
              <dd className="font-display text-bone text-2xl font-bold m-0">
                {fmtMoney(snapshot.orderGroupTotal ?? snapshot.total)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Delivery */}
        {(addr || snapshot.shippingMethod) && (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {addr && (
              <div className="bg-graphite border border-white/10 rounded-sm p-5">
                <p className="eyebrow text-steel mb-3">{tf.deliveryAddress}</p>
                <p className="text-sm text-bone leading-relaxed m-0">
                  {addr.first_name} {addr.last_name}<br />
                  {addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ''}<br />
                  {addr.postal_code} {addr.city}, {addr.province}<br />
                  {t.checkout.malaysia}{addr.phone ? <><br />{addr.phone}</> : null}
                </p>
              </div>
            )}
            {snapshot.shippingMethod && (
              <div className="bg-graphite border border-white/10 rounded-sm p-5">
                <p className="eyebrow text-steel mb-3">{tf.deliveryMethod}</p>
                <p className="text-sm text-bone m-0">{snapshot.shippingMethod}</p>
                <p className="font-mono text-[0.68rem] text-steel mt-1.5 m-0">
                  {/express/i.test(snapshot.shippingMethod) ? t.checkout.expressEta : t.checkout.standardEta}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to={lp('/shop')} className="btn-ember inline-flex">{tf.continueShopping}</Link>
          <p className="font-mono text-[0.7rem] text-steel mt-5">
            {tf.questionsPre}
            <Link to={lp('/contact')} className="text-ember-hot hover:underline">{tf.questionsLink}</Link>
            {tf.questionsPost}
          </p>
        </div>
      </div>
    </div>
  );
}

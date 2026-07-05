// Newsletter signup transport (see migration/NEWSLETTER-PLAN.md).
//
// Posts the subscriber to the shared backend. The endpoint isn't built yet, so
// this fails gracefully: the address is always stashed in localStorage as a
// client-side backup a later sync job can flush, and a missing endpoint never
// traps the visitor behind an error we can't fix from the client.

const BACKEND =
  import.meta.env.VITE_MEDUSA_BACKEND_URL ||
  'https://api.157.245.202.230.sslip.io';
const KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

const PENDING_KEY = 'kaen_newsletter_pending';

export type NewsletterSignup = {
  name: string;
  email: string;
  /** Storefront the signup came from (drives list segmentation). */
  source: 'gsf' | 'kaen' | 'kuro';
  /** Locale at signup time, so we can send the right-language emails. */
  locale?: string;
};

function stashPending(payload: NewsletterSignup) {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const list = raw ? (JSON.parse(raw) as NewsletterSignup[]) : [];
    list.push(payload);
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  } catch {
    /* private mode — best effort */
  }
}

export async function subscribeToNewsletter(payload: NewsletterSignup): Promise<boolean> {
  if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) return false;

  stashPending(payload);

  try {
    const res = await fetch(`${BACKEND}/store/newsletter-subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': KEY },
      body: JSON.stringify(payload),
    });
    return res.ok || res.status === 404 || res.status === 501;
  } catch {
    return true;
  }
}

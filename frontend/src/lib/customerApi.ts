// Customer auth + account API for the shared golf backend (Medusa v2 Store API).
// Uses ONLY standard Medusa endpoints — no custom backend routes (see plan.md).
//
// Customers are global across all three storefronts (one email = one account);
// each storefront just scopes its catalog/orders via its own publishable key.

const BACKEND =
  import.meta.env.VITE_MEDUSA_BACKEND_URL ||
  "https://api.157.245.202.230.sslip.io";
const KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || "";

/** Per-brand token key so storefronts on the same localhost port don't collide. */
const TOKEN_KEY = "kaen_auth_token";

/* ─────────────────────────── Types ─────────────────────────── */

export interface Customer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
}

export interface CustomerAddress {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

export interface AddressInput {
  first_name?: string;
  last_name?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
  phone?: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

export interface OrderLineItem {
  id: string;
  title: string;
  product_title?: string;
  variant_title?: string;
  quantity: number;
  unit_price: number;
  total?: number;
  thumbnail?: string | null;
}

export interface CustomerOrder {
  id: string;
  display_id?: number;
  status?: string;
  total: number;
  currency_code: string;
  created_at: string;
  email?: string;
  items?: OrderLineItem[];
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/* ───────────────────────── Token store ───────────────────────── */

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* private mode */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

/* ─────────────────────────── Fetch ─────────────────────────── */

async function api<T>(
  path: string,
  init?: { method?: string; body?: unknown; auth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {};
  if (KEY) headers["x-publishable-api-key"] = KEY;
  if (init?.body !== undefined) headers["content-type"] = "application/json";
  if (init?.auth) {
    const token = getToken();
    if (token) headers["authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}${path}`, {
      method: init?.method ?? "GET",
      headers,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new AuthError(
      "Could not reach the store. Please check your connection and try again."
    );
  }

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AuthError(
      json?.message || `Request failed (${res.status})`,
      res.status
    );
  }
  return json as T;
}

/* ─────────────────────────── Auth ─────────────────────────── */

/**
 * Register a new customer. Standard Medusa v2 flow:
 *  1. create the auth identity (returns a short-lived registration token)
 *  2. create the customer record with that token
 *  3. log in again for a token that resolves to the new customer
 */
export async function register(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<Customer> {
  let regToken: string;
  try {
    const r = await api<{ token: string }>(
      "/auth/customer/emailpass/register",
      { method: "POST", body: { email: input.email, password: input.password } }
    );
    regToken = r.token;
  } catch (e) {
    if (e instanceof AuthError && (e.status === 401 || e.status === 409)) {
      throw new AuthError(
        "An account with this email already exists. Please log in instead.",
        e.status
      );
    }
    throw e;
  }

  // Store the registration token so the create-customer call is authenticated
  // with it (it's the only credential that identifies the new auth identity).
  setToken(regToken);
  try {
    await api<{ customer: Customer }>("/store/customers", {
      method: "POST",
      body: {
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        ...(input.phone ? { phone: input.phone } : {}),
      },
      auth: true,
    });
  } catch (e) {
    clearToken();
    throw e;
  }

  // Re-login so the stored token resolves to the freshly created customer
  // (the registration token has an empty actor_id until this point).
  return login({ email: input.email, password: input.password });
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<Customer> {
  let token: string;
  try {
    const r = await api<{ token: string }>("/auth/customer/emailpass", {
      method: "POST",
      body: { email: input.email, password: input.password },
    });
    token = r.token;
  } catch (e) {
    if (e instanceof AuthError && e.status === 401) {
      throw new AuthError("Incorrect email or password.", 401);
    }
    throw e;
  }
  setToken(token);
  return getProfile();
}

export function logout(): void {
  clearToken();
}

/* ───────────────────────── Profile ───────────────────────── */

export async function getProfile(): Promise<Customer> {
  const { customer } = await api<{ customer: Customer }>(
    "/store/customers/me",
    { auth: true }
  );
  return customer;
}

export async function updateProfile(data: {
  first_name?: string;
  last_name?: string;
  phone?: string;
}): Promise<Customer> {
  const { customer } = await api<{ customer: Customer }>(
    "/store/customers/me",
    { method: "POST", body: data, auth: true }
  );
  return customer;
}

/* ───────────────────────── Addresses ───────────────────────── */

export async function listAddresses(): Promise<CustomerAddress[]> {
  const { addresses } = await api<{ addresses: CustomerAddress[] }>(
    "/store/customers/me/addresses",
    { auth: true }
  );
  return addresses || [];
}

export async function createAddress(
  address: AddressInput
): Promise<CustomerAddress[]> {
  const { customer } = await api<{ customer: { addresses?: CustomerAddress[] } }>(
    "/store/customers/me/addresses",
    { method: "POST", body: address, auth: true }
  );
  return customer?.addresses || listAddresses();
}

export async function updateAddress(
  id: string,
  address: AddressInput
): Promise<CustomerAddress[]> {
  const { customer } = await api<{ customer: { addresses?: CustomerAddress[] } }>(
    `/store/customers/me/addresses/${id}`,
    { method: "POST", body: address, auth: true }
  );
  return customer?.addresses || listAddresses();
}

export async function deleteAddress(id: string): Promise<void> {
  await api(`/store/customers/me/addresses/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

/* ─────────────────────────── Orders ─────────────────────────── */

export async function listOrders(limit = 20): Promise<CustomerOrder[]> {
  const { orders } = await api<{ orders: CustomerOrder[] }>(
    `/store/orders?limit=${limit}&order=-created_at`,
    { auth: true }
  );
  return orders || [];
}

import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../store/CustomerContext';
import { useI18n } from '../i18n/LanguageContext';
import { Field } from './Login';
import * as customerApi from '../lib/customerApi';
import type {
  Customer,
  CustomerAddress,
  CustomerOrder,
  AddressInput,
} from '../lib/customerApi';
import { fmtMoney } from '../lib/checkoutApi';
import { MY_STATES } from '../lib/states';

type Tab = 'profile' | 'addresses' | 'orders';

export default function Account() {
  const { customer, initializing, logout, updateProfile } = useCustomer();
  const { t, lp } = useI18n();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    if (!initializing && !customer) {
      navigate(lp('/login'), { replace: true, state: { from: lp('/account') } });
    }
  }, [initializing, customer, navigate, lp]);

  if (initializing || !customer) {
    return (
      <div className="min-h-screen bg-carbon pt-32 pb-24 px-5 text-center text-steel">
        {t.account.loading}
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: t.account.tabProfile },
    { id: 'addresses', label: t.account.tabAddresses },
    { id: 'orders', label: t.account.tabOrders },
  ];

  return (
    <div className="min-h-screen bg-carbon pt-32 pb-24 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow text-ember mb-3">{t.account.myAccount}</p>
            <h1 className="font-display text-4xl text-bone tracking-tightest">
              {t.account.greeting}, {customer.first_name || customer.email}
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate(lp('/'));
            }}
            className="font-[Archivo] text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-steel hover:text-ember-hot transition-colors"
          >
            {t.account.signOut}
          </button>
        </div>

        <div className="flex gap-6 border-b border-white/10 mb-8">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`pb-3 -mb-px font-[Archivo] text-[0.72rem] font-semibold uppercase tracking-[0.16em] border-b-2 transition-colors ${
                tab === tb.id
                  ? 'border-ember text-bone'
                  : 'border-transparent text-steel hover:text-bone'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <ProfilePanel customer={customer} onSave={updateProfile} />
        )}
        {tab === 'addresses' && <AddressPanel />}
        {tab === 'orders' && <OrdersPanel />}
      </div>
    </div>
  );
}

function ProfilePanel({
  customer,
  onSave,
}: {
  customer: Customer;
  onSave: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<void>;
}) {
  const { t } = useI18n();
  const [firstName, setFirstName] = useState(customer.first_name || '');
  const [lastName, setLastName] = useState(customer.last_name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      await onSave({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });
      setSaved(true);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-lg space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label={t.account.firstName} value={firstName} onChange={setFirstName} />
        <Field label={t.account.lastName} value={lastName} onChange={setLastName} />
      </div>
      <Field label={t.account.email} value={customer.email} onChange={() => {}} disabled />
      <Field label={t.account.phone} value={phone} onChange={setPhone} type="tel" />

      {err && <p className="text-sm text-ember-hot">{err}</p>}
      {saved && <p className="text-sm text-ember-hot">{t.account.profileUpdated}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-ember hover:bg-ember-hot text-white font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] px-8 py-3.5 transition-colors disabled:opacity-60"
      >
        {saving ? t.account.saving : t.account.saveChanges}
      </button>
    </form>
  );
}

function AddressPanel() {
  const { t } = useI18n();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAddresses(await customerApi.listAddresses());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    try {
      await customerApi.deleteAddress(id);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error');
    }
  };

  if (loading) return <p className="text-steel text-sm">{t.account.loadingAddresses}</p>;

  return (
    <div className="space-y-6">
      {err && <p className="text-sm text-ember-hot">{err}</p>}

      {addresses.length === 0 && !showForm && (
        <p className="text-steel text-sm">{t.account.noAddresses}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="border border-white/10 bg-graphite p-5 text-sm text-ash/80"
          >
            <p className="text-bone font-medium">
              {a.first_name} {a.last_name}
            </p>
            <p>{a.address_1}</p>
            {a.address_2 && <p>{a.address_2}</p>}
            <p>
              {a.city}{a.province ? `, ${a.province}` : ''} {a.postal_code}
            </p>
            <p className="uppercase text-xs tracking-wider text-steel mt-1">
              {a.country_code}
            </p>
            {a.phone && <p className="mt-1">{a.phone}</p>}
            <button
              onClick={() => remove(a.id)}
              className="mt-3 font-[Archivo] text-[0.68rem] uppercase tracking-[0.14em] text-ember-hot hover:text-ember"
            >
              {t.account.deleteLabel}
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <AddressForm
          onCancel={() => setShowForm(false)}
          onSaved={async () => {
            setShowForm(false);
            await load();
          }}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-ember hover:bg-ember-hot text-white font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] px-8 py-3.5 transition-colors"
        >
          {t.account.addAddress}
        </button>
      )}
    </div>
  );
}

function AddressForm({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState<AddressInput>({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    province: '',
    postal_code: '',
    country_code: 'my',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof AddressInput) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await customerApi.createAddress(form);
      onSaved();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Error');
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border border-white/10 bg-graphite p-6 space-y-4 max-w-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <Field label={t.account.firstName} value={form.first_name || ''} onChange={set('first_name')} />
        <Field label={t.account.lastName} value={form.last_name || ''} onChange={set('last_name')} />
      </div>
      <Field label={t.account.address} value={form.address_1 || ''} onChange={set('address_1')} />
      <Field label={t.account.address2} value={form.address_2 || ''} onChange={set('address_2')} />
      <div className="grid grid-cols-2 gap-4">
        <Field label={t.account.city} value={form.city || ''} onChange={set('city')} />
        <label className="block">
          <span className="block font-[Archivo] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-steel mb-2">
            {t.account.state}
          </span>
          <select
            required
            value={form.province || ''}
            onChange={(e) => set('province')(e.target.value)}
            className="w-full bg-steelplate/50 border border-white/10 px-4 py-3 text-bone outline-none transition-colors focus:border-ember focus:ring-1 focus:ring-ember"
          >
            <option value="" disabled>{t.account.selectState}</option>
            {MY_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <Field label={t.account.postcode} value={form.postal_code || ''} onChange={set('postal_code')} />
      <Field label={t.account.phone} value={form.phone || ''} onChange={set('phone')} type="tel" />

      {err && <p className="text-sm text-ember-hot">{err}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-ember hover:bg-ember-hot text-white font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] px-8 py-3.5 transition-colors disabled:opacity-60"
        >
          {saving ? t.account.saving : t.account.saveAddress}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-[Archivo] text-sm font-semibold uppercase tracking-[0.12em] text-steel hover:text-bone px-4"
        >
          {t.account.cancel}
        </button>
      </div>
    </form>
  );
}

function OrdersPanel() {
  const { t } = useI18n();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setOrders(await customerApi.listOrders());
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-steel text-sm">{t.account.loadingOrders}</p>;
  if (err) return <p className="text-sm text-ember-hot">{err}</p>;
  if (orders.length === 0)
    return <p className="text-steel text-sm">{t.account.noOrders}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="font-[Archivo] text-[0.68rem] uppercase tracking-[0.14em] text-steel border-b border-white/10">
            <th className="py-3 pr-4">{t.account.orderCol}</th>
            <th className="py-3 pr-4">{t.account.dateCol}</th>
            <th className="py-3 pr-4">{t.account.itemsCol}</th>
            <th className="py-3 pr-4 text-right">{t.account.totalCol}</th>
            <th className="py-3 text-right">{t.account.statusCol}</th>
          </tr>
        </thead>
        <tbody className="text-ash/80">
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-white/5">
              <td className="py-3 pr-4 text-bone">
                #{o.display_id ?? o.id.slice(-6)}
              </td>
              <td className="py-3 pr-4">
                {new Date(o.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                {(o.items || []).reduce((n, i) => n + i.quantity, 0)}
              </td>
              <td className="py-3 pr-4 text-right">{fmtMoney(o.total)}</td>
              <td className="py-3 text-right">
                <span className="capitalize text-ember-hot">{o.status || '—'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

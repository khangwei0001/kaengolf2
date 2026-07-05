import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../store/CustomerContext';
import { useI18n } from '../i18n/LanguageContext';

export default function Login() {
  const { login, loading, error, clearError } = useCustomer();
  const { t, lp } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo =
    (location.state as { from?: string } | null)?.from || lp('/account');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch {
      /* surfaced via context */
    }
  };

  return (
    <div className="min-h-screen bg-carbon pt-32 pb-24 px-5">
      <div className="max-w-md mx-auto">
        <p className="eyebrow text-ember mb-3">{t.account.members}</p>
        <h1 className="font-display text-4xl text-bone tracking-tightest mb-8">
          {t.account.loginTitle}
        </h1>

        {error && (
          <div className="mb-6 border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-hot">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Field
            label={t.account.email}
            type="email"
            value={email}
            onChange={(v) => {
              clearError();
              setEmail(v);
            }}
            autoComplete="email"
            required
          />
          <Field
            label={t.account.password}
            type="password"
            value={password}
            onChange={(v) => {
              clearError();
              setPassword(v);
            }}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ember hover:bg-ember-hot text-white font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t.account.signingIn : t.account.signIn}
          </button>
        </form>

        <p className="mt-8 text-sm text-steel">
          {t.account.noAccount}{' '}
          <Link
            to={lp('/register')}
            state={{ from: redirectTo }}
            className="text-ember-hot hover:text-ember underline underline-offset-4"
          >
            {t.account.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  disabled,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-[Archivo] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-steel mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        disabled={disabled}
        className="w-full bg-steelplate/50 border border-white/10 px-4 py-3 text-bone placeholder-steel/40 outline-none transition-colors focus:border-ember focus:ring-1 focus:ring-ember disabled:opacity-50"
      />
    </label>
  );
}

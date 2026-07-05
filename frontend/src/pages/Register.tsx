import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomer } from '../store/CustomerContext';
import { useI18n } from '../i18n/LanguageContext';
import { Field } from './Login';

export default function Register() {
  const { register, loading, error, clearError } = useCustomer();
  const { t, lp } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo =
    (location.state as { from?: string } | null)?.from || lp('/account');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });
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
          {t.account.registerTitle}
        </h1>

        {error && (
          <div className="mb-6 border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-hot">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label={t.account.firstName}
              value={firstName}
              onChange={setFirstName}
              autoComplete="given-name"
              required
            />
            <Field
              label={t.account.lastName}
              value={lastName}
              onChange={setLastName}
              autoComplete="family-name"
              required
            />
          </div>
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
            label={t.account.phoneOptional}
            type="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
          />
          <Field
            label={t.account.password}
            type="password"
            value={password}
            onChange={(v) => {
              clearError();
              setPassword(v);
            }}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ember hover:bg-ember-hot text-white font-[Archivo] text-sm font-semibold uppercase tracking-[0.14em] py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t.account.creatingAccount : t.account.createAccount}
          </button>
        </form>

        <p className="mt-8 text-sm text-steel">
          {t.account.haveAccount}{' '}
          <Link
            to={lp('/login')}
            state={{ from: redirectTo }}
            className="text-ember-hot hover:text-ember underline underline-offset-4"
          >
            {t.account.signIn}
          </Link>
        </p>
      </div>
    </div>
  );
}

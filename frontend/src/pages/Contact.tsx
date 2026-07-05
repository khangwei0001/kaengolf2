import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../i18n/LanguageContext';

const TEAM = [
  { img: 'team1', name: 'Aya Nakamura', role: 'Lead Shaft Engineer', loc: 'Tokyo' },
  { img: 'team2', name: 'Marcus Bell', role: 'Master Club Fitter', loc: 'London' },
  { img: 'team3', name: 'Mei Tanaka', role: 'Composite Designer', loc: 'Osaka' },
  { img: 'team4', name: 'David Hollis', role: 'Tour & Player Liaison', loc: 'Phoenix' },
  { img: 'team5', name: 'Liam Carter', role: 'Product Director', loc: 'Tokyo' },
  { img: 'team6', name: 'Susan Greer', role: 'Operations & Care', loc: 'Tokyo' },
] as const;

export default function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  useReveal();

  return (
    <div className="bg-carbon">
      {/* hero + form */}
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/background/background4.avif" alt="" className="ken-burns w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/90 to-carbon/70" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-24 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="reveal">
            <p className="eyebrow text-ember-hot mb-5">{t.contact.eyebrow}</p>
            <h1 className="display-hero text-bone text-[clamp(2.4rem,6vw,4.4rem)] mb-6">
              {t.contact.title1}
              <br />
              {t.contact.title2}
            </h1>
            <p className="text-bone/70 leading-relaxed max-w-md mb-8">{t.contact.intro}</p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="eyebrow text-steel mb-1">{t.contact.emailLabel}</p>
                <a href="mailto:info@kaengolf.jp" className="text-bone hover:text-ember-hot transition-colors">
                  info@kaengolf.jp
                </a>
              </div>
              <div>
                <p className="eyebrow text-steel mb-1">{t.contact.wholesaleLabel}</p>
                <a href="tel:0676321676" className="text-bone hover:text-ember-hot transition-colors">
                  06-7632-1676
                </a>
              </div>
              <div>
                <p className="eyebrow text-steel mb-1">{t.contact.studioLabel}</p>
                <address className="not-italic text-bone/85 leading-relaxed">
                  1-1-1 Minami Aoyama, Minato-ku
                  <br />
                  7F Shin-Aoyama Building East, Tokyo 107-0062
                </address>
              </div>
            </div>
          </div>

          {/* form */}
          <div className="reveal carbon-weave border border-white/10 rounded-sm p-7 sm:p-9 shadow-float">
            {sent ? (
              <div className="py-16 text-center">
                <span className="ember-text font-display text-5xl font-bold">炎</span>
                <h2 className="font-display text-bone text-2xl font-bold mt-5 tracking-tight">
                  {t.contact.sentTitle}
                </h2>
                <p className="text-steel mt-3">{t.contact.sentBody}</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-7">
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <p className="eyebrow text-steel">{t.contact.formHeading}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.contact.firstName} name="first" placeholder="Taro" required />
                  <Field label={t.contact.lastName} name="last" placeholder="Yamada" required />
                </div>
                <Field label={t.contact.email} name="email" type="email" placeholder="you@email.com" required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={t.contact.phone} name="phone" type="tel" placeholder="+81 …" />
                  <Field label={t.contact.address} name="address" placeholder={t.contact.addressPlaceholder} />
                </div>
                <label className="block">
                  <span className="eyebrow text-steel mb-2 block">{t.contact.message}</span>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={t.contact.messagePlaceholder}
                    className="field resize-none"
                  />
                </label>
                <button type="submit" className="btn-ember w-full justify-center">
                  {t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* team */}
      {/* <section className="bg-ash text-carbon py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
          <div className="max-w-2xl reveal mb-14">
            <p className="eyebrow text-ember-deep mb-4">{t.contact.teamEyebrow}</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest mb-5">
              {t.contact.teamTitle}
            </h2>
            <p className="text-carbon/70 leading-relaxed">{t.contact.teamBody}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {TEAM.map((m) => (
              <article key={m.img} className="reveal group">
                <div className="relative overflow-hidden rounded-sm bg-steelplate">
                  <img
                    src={`/team/${m.img}.avif`}
                    alt={m.name}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="pt-4">
                  <h3 className="font-display text-carbon text-lg font-bold tracking-tight">{m.name}</h3>
                  <p className="text-carbon/70 text-sm">{t.contact.roles[m.role]}</p>
                  <p className="eyebrow text-ember-deep mt-1">{t.contact.locs[m.loc]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-steel mb-2 block">{label}</span>
      <input type={type} name={name} placeholder={placeholder} required={required} className="field" />
    </label>
  );
}

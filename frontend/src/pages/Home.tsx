import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import SwingArc from '../components/SwingArc';
import Embers from '../components/Embers';
import SpokeRing from '../components/SpokeRing';
import Typewriter from '../components/Typewriter';
import RotatingWord from '../components/RotatingWord';
import TypeOnce from '../components/TypeOnce';
import HeatFlow from '../components/HeatFlow';
import CursorGlow from '../components/CursorGlow';
import { PRODUCTS, CATEGORY_LABEL, money } from '../data/products';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../i18n/LanguageContext';
import type { Strings } from '../i18n/strings';

const TECH = [
  { key: 'HDC', image: '/kaen_product_design/High density carbon.avif' },
  { key: 'ATT', image: '/kaen_product_design/Active Torque Technology.avif' },
  { key: 'HCL', image: '/kaen_product_design/hybrid carbon layering.avif' },
] as const;

// Pull a tech card's localized {title, copy, metric} out of the dictionary.
const techInfo = (t: Strings, key: (typeof TECH)[number]['key']) => {
  const h = t.home;
  if (key === 'HDC') return { title: h.techHdcTitle, copy: h.techHdcCopy, metric: h.techHdcMetric };
  if (key === 'ATT') return { title: h.techAttTitle, copy: h.techAttCopy, metric: h.techAttMetric };
  return { title: h.techHclTitle, copy: h.techHclCopy, metric: h.techHclMetric };
};

const PILLARS = [
  { key: 'aero', bg: '/background/background1.avif' },
  { key: 'composite', bg: '/background/background3.avif' },
  { key: 'fibre', bg: '/background/background4.avif' },
] as const;

// Pull a pillar's localized {title, lead, points} out of the dictionary.
const pillarInfo = (t: Strings, key: (typeof PILLARS)[number]['key']) => {
  const h = t.home;
  if (key === 'aero')
    return { title: h.pillarAeroTitle, lead: h.pillarAeroLead, points: [h.pillarAeroP1, h.pillarAeroP2, h.pillarAeroP3] };
  if (key === 'composite')
    return { title: h.pillarCompTitle, lead: h.pillarCompLead, points: [h.pillarCompP1, h.pillarCompP2, h.pillarCompP3] };
  return { title: h.pillarFibreTitle, lead: h.pillarFibreLead, points: [h.pillarFibreP1, h.pillarFibreP2, h.pillarFibreP3] };
};

const TEAM = ['team1', 'team2', 'team3', 'team4', 'team5', 'team6'];

export default function Home() {
  useReveal();
  return (
    <div className="bg-carbon">
      <Hero />
      <About />
      <Technology />
      <DescendingTip />
      <Featured />
      <WhyUs />
      {/* <Team /> */}
      <Newsletter />
    </div>
  );
}

/* ----------------------------------------------------------------- HERO */
function Hero() {
  const { t, lp } = useI18n();
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden grain">
      {/* shaft photography, heavily darkened, drifting slowly */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/background/background1.avif"
          alt=""
          className="ken-burns w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/70" />
      </div>

      {/* rotating heat wash + a drifting ember aurora for ambient motion */}
      <div className="heat-sweep -top-[30vh] -right-[18vw] w-[80vw] h-[120vh] opacity-70" />
      <div className="ember-aurora bottom-[-20vh] left-[-10vw] w-[55vw] h-[70vh]" />

      {/* ambient forge sparks rising through the frame */}
      <Embers count={24} className="opacity-90" />

      {/* signature swing-arc + ember bloom, top-right */}
      <div className="pointer-events-none absolute -top-20 -right-24 w-[min(60vw,720px)] opacity-90">
        <SwingArc count={30} sweep={210} rotate={-6} breathe />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[60vh] ember-bloom heat-pulse opacity-60 blur-2xl" />

      <div className="relative w-full mx-auto max-w-[1400px] px-5 sm:px-8 pb-20 pt-32">
        <p className="hero-anim eyebrow text-ember-hot mb-7 min-h-[2.6em] sm:min-h-[1.3em]" style={{ '--d': '0.05s' } as CSSProperties}>
          <Typewriter
            prefix="炎 — "
            phrases={[t.home.tw1, t.home.tw2, t.home.tw3, t.home.tw4]}
          />
        </p>
        <h1
          className="hero-cast display-hero text-bone text-[clamp(3.2rem,11vw,9.5rem)]"
          style={{ '--d': '0.18s' } as CSSProperties}
        >
          KAEN
        </h1>
        <p
          className="hero-anim display-hero text-[clamp(1.4rem,4.5vw,3.2rem)] text-bone/70 -mt-1 mb-7"
          style={{ '--d': '0.42s' } as CSSProperties}
        >
          {t.home.heroSubtitle}
        </p>
        <p
          className="hero-anim text-bone/75 text-lg max-w-xl leading-relaxed mb-9"
          style={{ '--d': '0.56s' } as CSSProperties}
        >
          {t.home.heroDesc}
        </p>
        <div
          className="hero-anim flex flex-wrap items-center gap-4"
          style={{ '--d': '0.68s' } as CSSProperties}
        >
          <Link to={lp('/shop')} className="btn-ember">
            {t.home.shopNow}
            <Arrow />
          </Link>
          <a href="#about" className="btn-ghost">
            {t.home.whyKaen}
          </a>
        </div>

        {/* corner data ticks */}
        <div
          className="hero-anim mt-16 grid grid-cols-3 gap-6 max-w-2xl border-t border-white/10 pt-6"
          style={{ '--d': '0.8s' } as CSSProperties}
        >
          {[
            [t.home.tick1a, t.home.tick1b],
            ['1.6°–4.1°', t.home.tick2b],
            [t.home.tick3a, t.home.tick3b],
          ].map(([a, b]) => (
            <div key={a}>
              <p className="font-display text-bone text-base sm:text-xl font-bold leading-none">{a}</p>
              <p className="eyebrow text-steel mt-2">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ABOUT */
function About() {
  const { t } = useI18n();
  const aboutRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  // start all three type-once blocks together, the moment the copy scrolls in
  useEffect(() => {
    const el = aboutRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setTyping(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setTyping(true), io.disconnect())),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="relative bg-ash text-carbon py-24 sm:py-32 overflow-hidden">
      {/* ember heat streaming sideways beneath the copy — felt, not seen */}
      <HeatFlow className="opacity-[0.1]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-5">{t.home.aboutEyebrow}</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              {t.home.aboutTitle1}
              <br />
              {t.home.aboutTitle2}
            </h2>
          </div>
          <div ref={aboutRef} className="space-y-6 text-carbon/75 text-[1.05rem] leading-relaxed">
            <TypeOnce start={typing} speed={11} className="block" text={t.home.aboutP1} />
            <TypeOnce start={typing} speed={11} className="block" text={t.home.aboutP2} />
            <div className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
              {[
                [t.home.aboutStat1a, t.home.aboutStat1b],
                [t.home.aboutStat2a, t.home.aboutStat2b],
                [t.home.aboutStat3a, t.home.aboutStat3b],
              ].map(([a, b]) => (
                <div key={a}>
                  <p className="font-display text-carbon text-xl font-bold">
                    <TypeOnce start={typing} speed={52} text={a} />
                  </p>
                  <p className="eyebrow text-carbon/50 mt-1">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- TECHNOLOGY */
function Technology() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  return (
    <section className="relative carbon-weave grain py-24 sm:py-32 overflow-hidden">
      {/* Edgerton strobe swing drifting behind the engineering — the very
          image the KAEN mark echoes; screen blend drops its black ground */}
      <img
        src="/styles2/golf-product-excellence.jpg"
        alt=""
        aria-hidden="true"
        className="ken-burns pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 h-[130%] w-auto object-contain opacity-[0.14] mix-blend-screen"
      />
      <div className="heat-sweep top-[10%] -right-[10vw] w-[46vw] h-[80vh] opacity-60" style={{ '--sweep-dur': '20s' } as CSSProperties} />

      {/* an ember flame trails the cursor across the engineering */}
      <CursorGlow />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="reveal">
            <p className="eyebrow text-ember-hot mb-4">{t.home.techEyebrow}</p>
            <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              {t.home.techTitle1}
              <br />
              {t.home.techTitle2}
            </h2>
          </div>
          <p className="reveal text-steel max-w-sm text-sm leading-relaxed">{t.home.techIntro}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          {/* selector list */}
          <div className="order-2 lg:order-1 divide-y divide-white/10 border-y border-white/10">
            {TECH.map((item, i) => {
              const open = i === active;
              const info = techInfo(t, item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(i)}
                  className="group w-full text-left py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                  aria-expanded={open}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono text-xs tracking-[0.2em] transition-colors ${
                        open ? 'text-ember' : 'text-steel'
                      }`}
                    >
                      {item.key}
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span
                      className={`font-display text-lg sm:text-2xl font-bold tracking-tight transition-colors ${
                        open ? 'text-bone' : 'text-steel group-hover:text-bone'
                      }`}
                    >
                      {info.title}
                    </span>
                  </div>
                  <div
                    className={`grid transition-all duration-500 ${
                      open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-bone/70 text-[0.97rem] leading-relaxed max-w-md">{info.copy}</p>
                      <p className="eyebrow text-ember-hot mt-4">↳ {info.metric}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* badge visual */}
          <div className="order-1 lg:order-2 relative reveal">
            <div className="relative aspect-square max-w-[440px] mx-auto">
              <div className="absolute inset-0 ember-bloom heat-pulse opacity-40 blur-2xl rounded-full" />
              {TECH.map((item, i) => (
                <img
                  key={item.key}
                  src={item.image}
                  alt={`${techInfo(t, item.key).title} diagram`}
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
                    i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- DESCENDING PARALLEL TIP */
function DescendingTip() {
  const { t, lp } = useI18n();
  return (
    <section className="bg-ash text-carbon py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-5">{t.home.tipEyebrow}</p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-tightest mb-6">
              {t.home.tipTitle}
            </h2>
            <p className="text-carbon/75 leading-relaxed mb-5">{t.home.tipP}</p>
            <Link to={lp('/learn')} className="link-sweep font-[Archivo] font-semibold text-ember-deep text-sm uppercase tracking-[0.12em]">
              {t.home.tipLink}
            </Link>
          </div>

          {/* tapering shaft diagram */}
          <div className="reveal">
            <ShaftDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}

function ShaftDiagram() {
  const { t } = useI18n();
  const cuts = [0.62, 0.7, 0.78, 0.86];
  return (
    <figure className="bg-white rounded-sm border border-carbon/10 p-7 shadow-card">
      <figcaption className="flex justify-between eyebrow text-carbon/50 mb-6">
        <span>{t.home.diagButt}</span>
        <span>{t.home.diagTip}</span>
      </figcaption>
      <svg viewBox="0 0 600 120" className="w-full">
        <defs>
          <linearGradient id="tip-scan-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF4D17" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FF8A3D" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FF4D17" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* descending taper */}
        <path d="M0 38 L600 54 L600 66 L0 82 Z" fill="#0C0D0F" />
        <path d="M0 38 L600 54 L600 60 L0 60 Z" fill="#1F2228" />
        {/* ember scan travelling toward the tip, tuning as it goes */}
        <rect className="tip-scan" x="-4" y="20" width="8" height="80" fill="url(#tip-scan-grad)" />
        {cuts.map((c, i) => (
          <g key={i}>
            <line x1={600 * c} y1="22" x2={600 * c} y2="98" stroke="#FF4D17" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle
              className="tip-marker"
              cx={600 * c}
              cy="22"
              r="3"
              fill="#FF4D17"
              style={{ animationDelay: `${i * 0.32}s` }}
            />
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-5 font-mono text-[0.66rem] text-carbon/45">
        <span>{t.home.diagFoot1}</span>
        <span>{t.home.diagFoot2}</span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------- FEATURED */
function Featured() {
  const { t, lp } = useI18n();
  const reel = [...PRODUCTS, ...PRODUCTS];
  return (
    <section className="bg-carbon py-20 overflow-hidden border-y border-white/10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-ember-hot mb-3">{t.home.featEyebrow}</p>
          <h2 className="font-display text-bone text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold tracking-tightest">
            {t.home.featTitle}
          </h2>
        </div>
        <Link to={lp('/shop')} className="hidden sm:inline-flex btn-ghost">
          {t.home.featViewAll}
        </Link>
      </div>

      <div className="relative">
        <div className="marquee-track gap-5">
          {reel.map((p, i) => (
            <Link
              key={p.id + i}
              to={lp('/shop')}
              className="group relative w-[270px] shrink-0 rounded-sm overflow-hidden border border-white/10 bg-graphite"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/85 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5">
                <p className="eyebrow text-ember-hot mb-1">{CATEGORY_LABEL[p.category]}</p>
                <p className="font-[Archivo] text-bone font-semibold leading-tight">{p.name}</p>
                <p className="font-mono text-steel text-xs mt-1">{money(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-carbon to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-carbon to-transparent" />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- WHY US */
function WhyUs() {
  const { t } = useI18n();
  return (
    <section className="relative bg-carbon py-24 sm:py-32 grain overflow-hidden">
      {/* a large strobe ring turns slowly behind the heading */}
      <SpokeRing
        duration={95}
        reverse
        className="absolute left-1/2 top-[8%] -translate-x-1/2 w-[720px] max-w-none opacity-[0.1]"
      />
      <div className="ember-aurora left-1/2 top-[2%] -translate-x-1/2 w-[42vw] h-[46vh]" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <p className="eyebrow text-ember-hot mb-4">{t.home.whyEyebrow}</p>
          <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
            {t.home.whyPrefix}
            <RotatingWord className="ember-text" words={[t.home.rot1, t.home.rot2, t.home.rot3, t.home.rot4]} />
            {t.home.whySuffix}
          </h2>
        </div>

        <div className="reveal-group grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => {
            const info = pillarInfo(t, p.key);
            return (
              <article
                key={p.key}
                className="group relative rounded-sm overflow-hidden border border-white/10 min-h-[420px] flex flex-col justify-end p-7 transition-transform duration-500 hover:-translate-y-1.5"
              >
                <img
                  src={p.bg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-25 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/30" />
                <div className="relative">
                  <span className="accent-bar block w-10 h-[3px] bg-ember mb-5" />
                  <p className="eyebrow text-ember-hot mb-2">{info.lead}</p>
                  <h3 className="font-display text-bone text-xl font-bold tracking-tight mb-5">
                    {info.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {info.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-3 text-bone/80 text-sm">
                        <span className="mt-2 w-1.5 h-1.5 bg-ember shrink-0 rotate-45" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ TEAM */
function Team() {
  const { t, lp } = useI18n();
  return (
    <section className="bg-ash text-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-4">{t.home.teamEyebrow}</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              {t.home.teamTitle1}
              <br />
              {t.home.teamTitle2}
            </h2>
          </div>
          <Link to={lp('/contact')} className="btn-ember self-start md:self-auto">
            {t.home.teamCta}
            <Arrow />
          </Link>
        </div>

        <div className="reveal-fade-group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TEAM.map((member, i) => (
            <div
              key={member}
              className={`group relative overflow-hidden rounded-sm bg-steelplate ${
                i % 2 === 0 ? 'lg:translate-y-4' : ''
              }`}
            >
              <img
                src={`/team/${member}.avif`}
                alt="KAEN team member"
                className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ember/0 group-hover:bg-ember/10 transition-colors mix-blend-multiply" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ NEWSLETTER */
function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="relative carbon-weave overflow-hidden">
      {/* cinematic driver-and-ball closing frame, screened onto the dark */}
      <img
        src="/styles2/background2.jpg"
        alt=""
        aria-hidden="true"
        className="ken-burns pointer-events-none absolute inset-0 w-full h-full object-cover opacity-[0.16] mix-blend-screen"
      />
      <div className="absolute inset-0 ember-bloom heat-pulse opacity-70" />
      <Embers count={16} className="opacity-80" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow text-ember-hot mb-4">{t.home.nlEyebrow}</p>
            <h2 className="font-display text-bone text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-tightest">
              {t.home.nlTitle}
            </h2>
          </div>
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setDone(true);
            }}
          >
            {done ? (
              <p className="font-[Archivo] text-bone text-lg font-semibold">
                {t.home.nlDone} <span className="text-ember-hot">炎</span>
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.home.nlPlaceholder}
                  className="field flex-1"
                  aria-label={t.home.nlPlaceholder}
                />
                <button type="submit" className="btn-ember justify-center">
                  {t.home.nlJoin}
                </button>
              </div>
            )}
            <p className="text-steel text-xs mt-3">{t.home.nlNote}</p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

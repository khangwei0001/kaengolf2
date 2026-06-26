import { Link } from 'react-router-dom';
import { useState } from 'react';
import SwingArc from '../components/SwingArc';
import { PRODUCTS, CATEGORY_LABEL, money } from '../data/products';
import { useReveal } from '../hooks/useReveal';

const TECH = [
  {
    key: 'HDC',
    title: 'High Density Carbon',
    image: '/kaen_product_design/High density carbon.avif',
    copy: 'Ultra-high-strength carbon fibres packed at exceptional density reinforce the shaft from core to surface — raising torsional rigidity, minimising deformation, and preserving geometry under maximum load.',
    metric: 'Torsional rigidity',
  },
  {
    key: 'ATT',
    title: 'Active Torque Technology',
    image: '/kaen_product_design/Active Torque Technology.avif',
    copy: 'A unique torque setting drawn from data collected by professional fitters worldwide. The shaft reads a wide range of swings and answers with stable control and consistent direction.',
    metric: 'Directional control',
  },
  {
    key: 'HCL',
    title: 'Hybrid Carbon Layering',
    image: '/kaen_product_design/hybrid carbon layering.avif',
    copy: 'High-elasticity carbon is woven at specific angles, in a specific order, to stabilise direction and tune how the shaft stores and returns energy through release.',
    metric: 'Energy return',
  },
] as const;

const PILLARS = [
  {
    title: 'Aerodynamic Design',
    lead: 'Cuts through the downswing',
    points: ['Faster speed with stability', 'Stronger, consistent impact', 'More responsive at the top'],
    bg: '/background/background1.avif',
  },
  {
    title: 'Special Composite Material',
    lead: 'Light where it counts, stiff where it matters',
    points: ['Rigidity with low weight', 'Maximum energy transfer', 'Solid strike at impact'],
    bg: '/background/background3.avif',
  },
  {
    title: 'Vigorous High-Density Fibre',
    lead: 'Repeatability you can trust',
    points: ['Consistency in trajectory', 'Uniformity in striking', 'Accuracy with narrower deviation'],
    bg: '/background/background4.avif',
  },
];

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
      <Team />
      <Newsletter />
    </div>
  );
}

/* ----------------------------------------------------------------- HERO */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden grain">
      {/* shaft photography, heavily darkened */}
      <div className="absolute inset-0">
        <img
          src="/background/background1.avif"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/85 to-carbon/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-carbon/70" />
      </div>

      {/* signature swing-arc + ember bloom, top-right */}
      <div className="pointer-events-none absolute -top-20 -right-24 w-[min(60vw,720px)] opacity-90">
        <SwingArc count={30} sweep={210} rotate={-6} />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 w-[40vw] h-[60vh] ember-bloom opacity-60 blur-2xl" />

      <div className="relative w-full mx-auto max-w-[1400px] px-5 sm:px-8 pb-20 pt-32">
        <p className="eyebrow text-ember-hot mb-7">
          炎 — Performance Composite · Engineered in Tokyo
        </p>
        <h1 className="display-hero text-bone text-[clamp(3.2rem,11vw,9.5rem)]">
          KAEN
        </h1>
        <p className="display-hero text-[clamp(1.4rem,4.5vw,3.2rem)] text-bone/70 -mt-1 mb-7">
          Performance Composites
        </p>
        <p className="text-bone/75 text-lg max-w-xl leading-relaxed mb-9">
          Carbon-fibre golf shafts built on a single descending design — one feel from
          driver to wedge, tuned only by where you cut the tip.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/shop" className="btn-ember">
            Shop Now
            <Arrow />
          </Link>
          <a href="#about" className="btn-ghost">
            Why KAEN
          </a>
        </div>

        {/* corner data ticks */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl border-t border-white/10 pt-6">
          {[
            ['Single shaft', 'driver → iron'],
            ['1.6°–4.1°', 'active torque range'],
            ['Est. 2020', 'a lockdown conversation'],
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
  return (
    <section id="about" className="relative bg-ash text-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-5">Get to know us</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              Not only a brand.
              <br />
              A network of golfers.
            </h2>
          </div>
          <div className="reveal space-y-6 text-carbon/75 text-[1.05rem] leading-relaxed">
            <p>
              KAEN Performance Composite is not only a brand, but a network of golf enthusiasts and
              industry professionals from around the world. It evolved from a casual conversation in
              early 2020 — amid the global pandemic and lockdown — into the products we offer today. A
              brand of passion, inspiration, and perseverance.
            </p>
            <p>
              Our shafts represent the collaboration of leading industry experts, designers, and
              manufacturing facilities worldwide, built on data from social, amateur and professional
              players. It is the melting pot of the past, present and future of the golf industry.
            </p>
            <div className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
              {[
                ['Global', 'experts & fitters'],
                ['Data-led', 'social → tour'],
                ['One design', 'descending parallel tip'],
              ].map(([a, b]) => (
                <div key={a}>
                  <p className="font-display text-carbon text-xl font-bold">{a}</p>
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
  const [active, setActive] = useState(0);
  return (
    <section className="relative carbon-weave grain py-24 sm:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="reveal">
            <p className="eyebrow text-ember-hot mb-4">The Engineering</p>
            <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              What makes a KAEN
              <br />
              shaft special.
            </h2>
          </div>
          <p className="reveal text-steel max-w-sm text-sm leading-relaxed">
            Three material systems work together inside every shaft. Select one to read how it shapes
            the feel of your swing.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          {/* selector list */}
          <div className="order-2 lg:order-1 divide-y divide-white/10 border-y border-white/10">
            {TECH.map((t, i) => {
              const open = i === active;
              return (
                <button
                  key={t.key}
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
                      {t.key}
                    </span>
                    <span className="h-px flex-1 bg-white/10" />
                    <span
                      className={`font-display text-lg sm:text-2xl font-bold tracking-tight transition-colors ${
                        open ? 'text-bone' : 'text-steel group-hover:text-bone'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div
                    className={`grid transition-all duration-500 ${
                      open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-bone/70 text-[0.97rem] leading-relaxed max-w-md">{t.copy}</p>
                      <p className="eyebrow text-ember-hot mt-4">↳ {t.metric}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* badge visual */}
          <div className="order-1 lg:order-2 relative reveal">
            <div className="relative aspect-square max-w-[440px] mx-auto">
              <div className="absolute inset-0 ember-bloom opacity-40 blur-2xl rounded-full" />
              {TECH.map((t, i) => (
                <img
                  key={t.key}
                  src={t.image}
                  alt={`${t.title} diagram`}
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
  return (
    <section className="bg-ash text-carbon py-24 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-5">Single-shaft philosophy</p>
            <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-tightest mb-6">
              Descending parallel tip design
            </h2>
            <p className="text-carbon/75 leading-relaxed mb-5">
              Every shaft — driver to irons — uses one descending design. By adjusting stiffness with
              tip cuts, you derive the optimal feel for your swing. The single-shaft advantage is
              outstanding: where constant-weight designs change with each club, the same shaft across
              the bag lets you swing without ever changing the feeling.
            </p>
            <Link to="/learn" className="link-sweep font-[Archivo] font-semibold text-ember-deep text-sm uppercase tracking-[0.12em]">
              See the lineup in detail →
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
  const cuts = [0.62, 0.7, 0.78, 0.86];
  return (
    <figure className="bg-white rounded-sm border border-carbon/10 p-7 shadow-card">
      <figcaption className="flex justify-between eyebrow text-carbon/50 mb-6">
        <span>Butt</span>
        <span>Tip · cut to tune</span>
      </figcaption>
      <svg viewBox="0 0 600 120" className="w-full">
        {/* descending taper */}
        <path d="M0 38 L600 54 L600 66 L0 82 Z" fill="#0C0D0F" />
        <path d="M0 38 L600 54 L600 60 L0 60 Z" fill="#1F2228" />
        {cuts.map((c, i) => (
          <g key={i}>
            <line x1={600 * c} y1="22" x2={600 * c} y2="98" stroke="#FF4D17" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={600 * c} cy="22" r="3" fill="#FF4D17" />
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-5 font-mono text-[0.66rem] text-carbon/45">
        <span>#stiffer / softer by tip cut →</span>
        <span>same feel · every club</span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------- FEATURED */
function Featured() {
  const reel = [...PRODUCTS, ...PRODUCTS];
  return (
    <section className="bg-carbon py-20 overflow-hidden border-y border-white/10">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 flex items-end justify-between mb-10">
        <div>
          <p className="eyebrow text-ember-hot mb-3">The Lineup</p>
          <h2 className="font-display text-bone text-[clamp(1.7rem,3.5vw,2.6rem)] font-bold tracking-tightest">
            Featured shafts
          </h2>
        </div>
        <Link to="/shop" className="hidden sm:inline-flex btn-ghost">
          View all
        </Link>
      </div>

      <div className="relative">
        <div className="marquee-track gap-5">
          {reel.map((p, i) => (
            <Link
              key={p.id + i}
              to="/shop"
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
  return (
    <section className="relative bg-carbon py-24 sm:py-32 grain overflow-hidden">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <p className="eyebrow text-ember-hot mb-4">Why choose us</p>
          <h2 className="font-display text-bone text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
            Three reasons it
            <span className="ember-text"> performs</span>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="reveal group relative rounded-sm overflow-hidden border border-white/10 min-h-[420px] flex flex-col justify-end p-7"
            >
              <img
                src={p.bg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-25 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/80 to-carbon/30" />
              <div className="relative">
                <span className="block w-10 h-[3px] bg-ember mb-5" />
                <p className="eyebrow text-ember-hot mb-2">{p.lead}</p>
                <h3 className="font-display text-bone text-xl font-bold tracking-tight mb-5">
                  {p.title}
                </h3>
                <ul className="space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-bone/80 text-sm">
                      <span className="mt-2 w-1.5 h-1.5 bg-ember shrink-0 rotate-45" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ TEAM */
function Team() {
  return (
    <section className="bg-ash text-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="reveal">
            <p className="eyebrow text-ember-deep mb-4">Meet our team</p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[0.98] tracking-tightest">
              Dedication. Expertise.
              <br />
              Passion.
            </h2>
          </div>
          <Link to="/contact" className="btn-ember self-start md:self-auto">
            Meet the full team
            <Arrow />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 reveal">
          {TEAM.map((t, i) => (
            <div
              key={t}
              className={`group relative overflow-hidden rounded-sm bg-steelplate ${
                i % 2 === 0 ? 'lg:translate-y-4' : ''
              }`}
            >
              <img
                src={`/team/${t}.avif`}
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
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="relative carbon-weave overflow-hidden">
      <div className="absolute inset-0 ember-bloom opacity-70" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow text-ember-hot mb-4">KAEN Newsletter</p>
            <h2 className="font-display text-bone text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-tightest">
              News, product alerts &amp; VIP experiences.
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
                You&apos;re in. Welcome to KAEN. <span className="text-ember-hot">炎</span>
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="field flex-1"
                  aria-label="Email address"
                />
                <button type="submit" className="btn-ember justify-center">
                  Join
                </button>
              </div>
            )}
            <p className="text-steel text-xs mt-3">
              Get the latest KAEN news, product alerts, VIP experiences, and more.
            </p>
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

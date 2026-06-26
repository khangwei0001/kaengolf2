import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

interface QA {
  q: string;
  a: React.ReactNode;
  image?: string;
}

const FAQS: QA[] = [
  {
    q: 'What are the features of KAEN shafts?',
    a: (
      <p>
        The unique soft flex and torque-reducing shaft design makes it easy to hit high-trajectory
        shots without losing energy. Try it and find out.
      </p>
    ),
    image: '/faq/faq1.png',
  },
  {
    q: 'How much tip cutting should I do?',
    a: (
      <p>
        See the shaft trimming chart. Fine adjustment of specifications is possible by tip cutting. We
        recommend asking a golf workshop, specialty store, or club manufacturer to assemble your club
        or replace the shaft.
      </p>
    ),
    image: '/faq/faq2.png',
  },
  {
    q: 'Do you offer a warranty or money-back guarantee?',
    a: (
      <p>
        If the shaft becomes damaged or unusable during normal play within one year of purchase,
        return it to the manufacturer (KAEN Japan Co., Ltd.) via your place of purchase. After
        inspection, confirmed manufacturing defects are exchanged for the same shaft. Damage from
        transport, handling, or external factors — intentional or negligent — is not eligible. The
        manufacturer does not provide money-back guarantees.
      </p>
    ),
  },
  {
    q: 'Do you have any social media?',
    a: (
      <p>
        Follow us on Instagram{' '}
        <a href="https://www.instagram.com/kaengolf_jp/" target="_blank" rel="noreferrer" className="text-ember-hot hover:underline">
          @kaengolf_jp
        </a>{' '}
        and Facebook{' '}
        <a href="https://www.facebook.com/kaengolf" target="_blank" rel="noreferrer" className="text-ember-hot hover:underline">
          KaenGolf
        </a>
        . Please follow along 🙂
      </p>
    ),
  },
  {
    q: 'Can you handle KAEN products? (Wholesale)',
    a: (
      <p>
        For wholesale enquiries, contact us at{' '}
        <a href="tel:0676321676" className="text-ember-hot hover:underline">
          TEL 06-7632-1676
        </a>{' '}
        or{' '}
        <a href="mailto:info@kaengolf.jp" className="text-ember-hot hover:underline">
          info@kaengolf.jp
        </a>
        .
      </p>
    ),
  },
  {
    q: 'Where is the full specification table?',
    a: (
      <p>
        The complete spec chart is large, so we host it as a PDF.{' '}
        <a
          href="https://c5b745e9-9246-447b-97f1-ef5d1e36fe98.usrfiles.com/ugd/4c5f1f_270df676eded45e2a4902c6c9d8200ec.pdf?dn=Specs%20.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-ember-hot hover:underline font-semibold"
        >
          Download Specs.pdf →
        </a>
      </p>
    ),
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number>(0);
  useReveal();

  return (
    <div className="bg-carbon min-h-screen">
      <section className="relative pt-[72px] grain overflow-hidden">
        <div className="absolute inset-0">
          <img src="/background/background3.avif" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/85 to-carbon/60" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 py-20 sm:py-24">
          <p className="eyebrow text-ember-hot mb-5">Support</p>
          <h1 className="display-hero text-bone text-[clamp(2.6rem,8vw,5.5rem)]">
            Frequently asked
            <br />
            questions.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 sm:px-8 py-16 sm:py-24">
        <div className="border-t border-white/10">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-white/10 reveal">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-start gap-5 py-6 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                  aria-expanded={isOpen}
                >
                  <span className="font-mono text-ember text-sm pt-1 shrink-0">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-display text-bone text-lg sm:text-xl font-bold tracking-tight leading-snug group-hover:text-ember-hot transition-colors">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 text-ember text-2xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7 pl-10 pr-2 text-bone/75 leading-relaxed">
                      {item.a}
                      {item.image && (
                        <div className="mt-5 rounded-sm overflow-hidden border border-white/10 bg-white inline-block max-w-full">
                          <img src={item.image} alt={item.q} className="max-w-full h-auto block" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 carbon-weave border border-white/10 rounded-sm p-8 text-center">
          <p className="text-bone/80 mb-1 font-[Archivo] font-semibold">Still have a question?</p>
          <p className="text-steel text-sm mb-5">Our team is in Tokyo and happy to help.</p>
          <Link to="/contact" className="btn-ember">
            Contact us →
          </Link>
        </div>
      </section>
    </div>
  );
}

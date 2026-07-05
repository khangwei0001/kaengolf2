export type CategoryKey = 'driver' | 'fairway' | 'hybrid' | 'iron' | 'wedge';

export interface Spec {
  label: string;
  value: string;
}

/** A concrete purchasable variant, needed to add a line item to the Medusa cart. */
export interface ProductVariant {
  id: string;
  title?: string;
  sku?: string;
  /** Option title -> value, e.g. { Series: "Darkness 60", Length: '45.5"' }. */
  options: Record<string, string>;
}

export interface Product {
  id: string;
  handle?: string;
  name: string;
  category: CategoryKey;
  price: number;
  image: string;
  /** short line shown on the card */
  tagline: string;
  /** longer copy on the detail view */
  description: string;
  series: string[];
  lengths: string[];
  sleeves: string[];
  grips: string[];
  specs: Spec[];
  /** technologies built into this shaft */
  tech: ('HDC' | 'ATT' | 'HCL')[];
  sourceUrl?: string;
  variants?: ProductVariant[];
}

export const CATEGORIES: { key: CategoryKey | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'driver', label: 'Driver Shaft' },
  { key: 'fairway', label: 'Fairway Wood Shaft' },
  { key: 'hybrid', label: 'Hybrid Shaft' },
  { key: 'iron', label: 'Iron Shaft' },
  { key: 'wedge', label: 'Wedge Shaft' },
];

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  driver: 'Driver',
  fairway: 'Fairway Wood',
  hybrid: 'Hybrid',
  iron: 'Iron',
  wedge: 'Wedge',
};

const woodSleeves = [
  'No Sleeve (raw)',
  'TaylorMade',
  'Callaway',
  'Titleist',
  'Ping',
  'Cobra',
];
const woodGrips = [
  'Golf Pride Tour Velvet 360',
  'Golf Pride MCC +4',
  'Lamkin Crossline',
  'No Grip',
];
const driverLengths = ['45.0"', '45.5"', '45.75"', '46.0"'];
const woodLengths = ['42.0"', '42.5"', '43.0"'];
const hybridLengths = ['39.5"', '40.0"', '40.5"'];
const ironLengths = ['37.0" (#7 ref.)', '38.0" (#5 ref.)', 'Build to spec'];
const wedgeLengths = ['35.0"', '35.25"', '35.5"'];

export const PRODUCTS: Product[] = [
  {
    id: 'darkness-driver',
    name: 'Darkness Driver Shaft',
    category: 'driver',
    price: 480,
    image: '/product_images/product_image_1.avif',
    tagline: 'Low-launch, low-spin control for the fastest swings.',
    description:
      'The flagship Darkness driver shaft pairs a stout tip section with High Density Carbon through the mid to hold geometry under maximum load. A penetrating, low-spin ball flight for players who deliver speed and want every bit of it back at impact.',
    series: ['Darkness 50', 'Darkness 60', 'Darkness 70'],
    lengths: driverLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['HDC', 'ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '58–74 g' },
      { label: 'Torque', value: '3.0°' },
      { label: 'Flex', value: 'R / S / X' },
      { label: 'Tip', value: '0.335 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Low' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'blaze-driver',
    name: 'Blaze Driver Shaft',
    category: 'driver',
    price: 460,
    image: '/product_images/product_image_2.avif',
    tagline: 'High, easy launch with a soft, energetic feel.',
    description:
      'Blaze loads early and snaps through release, lifting trajectory without sacrificing direction. Active Torque Technology keeps the face square through a wide range of swing types — the friendliest way into KAEN performance.',
    series: ['Blaze 40', 'Blaze 50', 'Blaze 60'],
    lengths: driverLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '47–66 g' },
      { label: 'Torque', value: '4.1°' },
      { label: 'Flex', value: 'R / SR / S' },
      { label: 'Tip', value: '0.335 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Mid-High' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'darkness-fw',
    name: 'Darkness FW Shaft',
    category: 'fairway',
    price: 420,
    image: '/product_images/product_image_3.avif.png',
    tagline: 'Tour-stable fairway flight off the deck or tee.',
    description:
      'A heavier, tip-stiff fairway profile that matches the Darkness driver for a seamless set feel. Built to flush long approaches with a controlled, boring trajectory.',
    series: ['Darkness FW 60', 'Darkness FW 70', 'Darkness FW 80'],
    lengths: woodLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['HDC', 'ATT'],
    specs: [
      { label: 'Weight', value: '64–82 g' },
      { label: 'Torque', value: '3.2°' },
      { label: 'Flex', value: 'R / S / X' },
      { label: 'Tip', value: '0.335 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Low-Mid' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'flyz-fw',
    name: 'FLYZ FW Shaft',
    category: 'fairway',
    price: 400,
    image: '/product_images/product_image_4.png',
    tagline: 'Lightweight lift that gets the ball up and going.',
    description:
      'FLYZ is the easy-launching counterpart to Darkness — lighter, more active, and tuned to carry fairway woods high and far for moderate swing speeds.',
    series: ['FLYZ FW 50', 'FLYZ FW 60', 'FLYZ FW 70'],
    lengths: woodLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '54–72 g' },
      { label: 'Torque', value: '3.6°' },
      { label: 'Flex', value: 'R / SR / S' },
      { label: 'Tip', value: '0.335 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Mid-High' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'darkness-hb',
    name: 'Darkness HB Shaft',
    category: 'hybrid',
    price: 360,
    image: '/product_images/product_image_5.png',
    tagline: 'Iron-like control in a hybrid package.',
    description:
      'Designed to bridge your long irons and fairway woods with no change in feel. Tip-stiff and stable for players who want to flight hybrids down and work the ball.',
    series: ['Darkness HB 70', 'Darkness HB 80', 'Darkness HB 90'],
    lengths: hybridLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['HDC', 'ATT'],
    specs: [
      { label: 'Weight', value: '72–92 g' },
      { label: 'Torque', value: '2.9°' },
      { label: 'Flex', value: 'R / S / X' },
      { label: 'Tip', value: '0.370 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Low-Mid' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'flyz-hb',
    name: 'FLYZ HB Shaft',
    category: 'hybrid',
    price: 350,
    image: '/product_images/product_image_6.png',
    tagline: 'Effortless height and forgiveness from long range.',
    description:
      'FLYZ hybrid lifts long shots with a soft, smooth load. The forgiving choice for getting hybrids airborne and landing soft.',
    series: ['FLYZ HB 60', 'FLYZ HB 70', 'FLYZ HB 80'],
    lengths: hybridLengths,
    sleeves: woodSleeves,
    grips: woodGrips,
    tech: ['ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '62–82 g' },
      { label: 'Torque', value: '3.3°' },
      { label: 'Flex', value: 'R / SR / S' },
      { label: 'Tip', value: '0.370 in' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Mid-High' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'pro-iron',
    name: 'Pro Iron Shaft',
    category: 'iron',
    price: 540,
    image: '/product_images/product_image_7.png',
    tagline: 'One single shaft across the set — tour weighting.',
    description:
      "KAEN's single-shaft iron concept: the same shaft in every iron, tuned only by tip cut. Constant feel from wedge to long iron, with the stability tour players demand.",
    series: ['Pro Iron 105', 'Pro Iron 115', 'Pro Iron 125'],
    lengths: ironLengths,
    sleeves: ['Iron tip (.370)', 'Iron tip (.355 taper)'],
    grips: woodGrips,
    tech: ['HDC', 'ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '105–127 g' },
      { label: 'Torque', value: '1.9°' },
      { label: 'Flex', value: 'R / S / X' },
      { label: 'Tip', value: '0.370 / 0.355' },
      { label: 'Set', value: 'Single-shaft, tip-cut tuned' },
      { label: 'Launch', value: 'Low' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'air-iron',
    name: 'Air Iron Shaft',
    category: 'iron',
    price: 520,
    image: '/product_images/product_image_8.png',
    tagline: 'Lightweight single shaft for speed and height.',
    description:
      'Air keeps the single-shaft philosophy but drops weight for players chasing more height and clubhead speed without losing the constant-feel advantage.',
    series: ['Air Iron 85', 'Air Iron 95', 'Air Iron 105'],
    lengths: ironLengths,
    sleeves: ['Iron tip (.370)', 'Iron tip (.355 taper)'],
    grips: woodGrips,
    tech: ['ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '85–107 g' },
      { label: 'Torque', value: '2.2°' },
      { label: 'Flex', value: 'R / S' },
      { label: 'Tip', value: '0.370 / 0.355' },
      { label: 'Set', value: 'Single-shaft, tip-cut tuned' },
      { label: 'Launch', value: 'Mid' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'dagger-pro-2',
    name: 'Dagger Pro Stage II',
    category: 'iron',
    price: 560,
    image: '/product_images/product_image_9.png',
    tagline: 'Five tip stages — T6 to T10 — dialed to your delivery.',
    description:
      'The Dagger Pro Stage II is offered across five tip stiffness stages (T6, T7, T8, T9, T10) so a fitter can match trajectory and feel to the way you deliver the club. The pinnacle of the single-shaft iron program.',
    series: ['T6', 'T7', 'T8', 'T9', 'T10'],
    lengths: ironLengths,
    sleeves: ['Iron tip (.370)', 'Iron tip (.355 taper)'],
    grips: woodGrips,
    tech: ['HDC', 'ATT', 'HCL'],
    specs: [
      { label: 'Weight', value: '110–130 g' },
      { label: 'Torque', value: '1.7°' },
      { label: 'Stage', value: 'T6 · T7 · T8 · T9 · T10' },
      { label: 'Tip', value: '0.370 / 0.355' },
      { label: 'Set', value: 'Single-shaft, tip-cut tuned' },
      { label: 'Launch', value: 'Low' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
  {
    id: 'circle-wedge',
    name: 'Circle Wedge Shaft',
    category: 'wedge',
    price: 180,
    image: '/product_images/product_image_10.png',
    tagline: 'Heavy, stable, and quiet around the greens.',
    description:
      'A dedicated wedge profile weighted to settle the hands and reward precise contact on partial shots. Matches the Pro and Air iron families for a seamless scoring set.',
    series: ['Circle Wedge 120', 'Circle Wedge 130'],
    lengths: wedgeLengths,
    sleeves: ['Iron tip (.370)', 'Iron tip (.355 taper)'],
    grips: woodGrips,
    tech: ['HDC', 'ATT'],
    specs: [
      { label: 'Weight', value: '120–132 g' },
      { label: 'Torque', value: '1.6°' },
      { label: 'Flex', value: 'Wedge' },
      { label: 'Tip', value: '0.370 / 0.355' },
      { label: 'Butt', value: '0.600 in' },
      { label: 'Launch', value: 'Low' },
      { label: 'Profile', value: 'Descending parallel tip' },
    ],
  },
];

export const money = (n: number) => 'RM' + n.toLocaleString('en-US');

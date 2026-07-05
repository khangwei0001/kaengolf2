// Content for legacy marketing pages recovered from the old Wix site
// (kaengolf.jp) that had no equivalent on the new site. Text captured via the
// testing/ crawler; Japanese translated from the English source. These pages
// stay reachable by URL + sitemap only (orphan), matching the old site.
import type { Lang } from '../i18n/strings';
import type { Block } from './legalPages';

export interface LegacyFigure {
  src: string;
  caption?: string;
  /** Span the full gallery width (for spec tables / charts). */
  wide?: boolean;
}

export interface LegacyDoc {
  eyebrow: string;
  title: string;
  description: string;
  lead: string;
  /** Recovered hero image (served from brand_assets). Falls back to a background. */
  heroImage?: string;
  blocks: Block[];
  figures?: LegacyFigure[];
}

export const LEGACY_PAGES: Record<string, Record<Lang, LegacyDoc>> = {
  'new-arrivals': {
    en: {
      eyebrow: 'New Arrivals',
      title: 'BLAZE & DARKNESS',
      description:
        'The latest KAEN performance wood shafts — BLAZE for higher, stronger ball flight and DARKNESS for maximum forgiveness.',
      heroImage: '/legacy/new-arrivals/blaze-hero.avif',
      lead: 'KAEN BLAZE, derived from the meaning of flaming in Japanese. BLAZE shaft is an enhanced profile design for players who seek higher ball flight with a mid-spin shaft profile. KAEN BLAZE produces sky-fire ball flight, strong and with maximum control of dispersion — thanks to our Hybrid Carbon Layering (H.C.L) and Active Torque Technology (A.T.T), allowing our engineers to produce a unique shaft profile with unbeatable performance in flexibility and shot accuracy for every golfer.',
      figures: [
        { src: '/legacy/new-arrivals/tech-ep.avif', caption: 'Enhanced Profile' },
        { src: '/legacy/new-arrivals/tech-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/new-arrivals/tech-hcl.avif', caption: 'Hybrid Carbon Layering' },
        { src: '/legacy/new-arrivals/blaze-spec.avif', caption: 'BLAZE — specifications', wide: true },
        { src: '/legacy/new-arrivals/darkness-trajectory.avif', caption: 'DARKNESS — ball flight trajectory', wide: true },
      ],
      blocks: [
        { type: 'h2', text: 'BLAZE' },
        { type: 'h3', text: 'Enhanced Profile' },
        {
          type: 'p',
          text: 'The new KAEN BLAZE is designed to enhance the swing momentum for the player and provide faster acceleration through the downswing and impact. It is FASTER.',
        },
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: 'Optimal torque setting, based on data gathered from professional fitters across the world, provides tighter shot dispersion and consistent feel with every shot.',
        },
        { type: 'h3', text: 'Hybrid Carbon Layering' },
        {
          type: 'p',
          text: 'H.C.L allows the shaft to react to various swing types to promote club acceleration during the downswing while maintaining impact stability. This means increased smash factor and tighter shot dispersion (distance and accuracy) across the board.',
        },
        { type: 'h2', text: 'DARKNESS' },
        { type: 'h3', text: 'Introduction' },
        {
          type: 'p',
          text: 'The new KAEN DARKNESS performance wood shafts come in four unique specifications, designed with data gathered from industry experts around the world. Our products are made with premium-grade carbon fiber materials bound with Carbon Fusion Technology.',
        },
        { type: 'h3', text: 'Performance' },
        {
          type: 'p',
          text: 'Optimal specification settings, based on extensive research along with our Active Torque Technology (A.T.T), Hybrid Carbon Layering (H.C.L) and Multi Axis Fiber (M.A.F), allow the shaft to react to various swing types to promote club acceleration during the downswing while maintaining impact stability. This means increased smash factor and tighter shot dispersion (distance and accuracy) across the board.',
        },
        { type: 'h3', text: 'Modern Design' },
        {
          type: 'p',
          text: 'Matte Vogue Design for a bold and trendy look that will turn heads and make a statement on the course.',
        },
      ],
    },
    ja: {
      eyebrow: '新着商品',
      title: 'BLAZE & DARKNESS',
      description:
        'KAEN 最新のパフォーマンスウッドシャフト — より高く力強い弾道の BLAZE と、最大限の寛容性を備えた DARKNESS。',
      heroImage: '/legacy/new-arrivals/blaze-hero.avif',
      lead: 'KAEN BLAZE は、日本語の「炎」に由来します。BLAZE シャフトは、ミッドスピンのシャフトプロファイルでより高い弾道を求めるプレーヤーのために設計された、強化プロファイル設計です。KAEN BLAZE は、当社の Hybrid Carbon Layering（H.C.L）と Active Torque Technology（A.T.T）により、力強く、ばらつきを最大限にコントロールした「スカイファイア」弾道を生み出します。これにより、当社のエンジニアは、あらゆるゴルファーにとって、しなやかさとショット精度において圧倒的な性能を持つ独自のシャフトプロファイルを実現しました。',
      figures: [
        { src: '/legacy/new-arrivals/tech-ep.avif', caption: '強化プロファイル' },
        { src: '/legacy/new-arrivals/tech-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/new-arrivals/tech-hcl.avif', caption: 'Hybrid Carbon Layering' },
        { src: '/legacy/new-arrivals/blaze-spec.avif', caption: 'BLAZE — スペック', wide: true },
        { src: '/legacy/new-arrivals/darkness-trajectory.avif', caption: 'DARKNESS — 弾道', wide: true },
      ],
      blocks: [
        { type: 'h2', text: 'BLAZE' },
        { type: 'h3', text: '強化プロファイル' },
        {
          type: 'p',
          text: '新しい KAEN BLAZE は、プレーヤーのスイングの勢いを高め、ダウンスイングからインパクトにかけてより速い加速をもたらすよう設計されています。より速く。',
        },
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: '世界中のプロフィッターから収集したデータに基づく最適なトルク設定により、ショットのばらつきが抑えられ、一打ごとに安定した打感が得られます。',
        },
        { type: 'h3', text: 'Hybrid Carbon Layering' },
        {
          type: 'p',
          text: 'H.C.L により、シャフトはさまざまなスイングタイプに反応し、インパクトの安定性を保ちながらダウンスイング中のクラブの加速を促進します。これにより、スマッシュファクターが向上し、飛距離と精度の両面でショットのばらつきが抑えられます。',
        },
        { type: 'h2', text: 'DARKNESS' },
        { type: 'h3', text: 'はじめに' },
        {
          type: 'p',
          text: '新しい KAEN DARKNESS パフォーマンスウッドシャフトは、世界中の業界エキスパートから収集したデータをもとに設計された、4 つの独自スペックで展開します。当社の製品は、Carbon Fusion Technology で結合されたプレミアムグレードのカーボンファイバー素材で作られています。',
        },
        { type: 'h3', text: 'パフォーマンス' },
        {
          type: 'p',
          text: '広範な研究に基づく最適なスペック設定は、Active Torque Technology（A.T.T）、Hybrid Carbon Layering（H.C.L）、Multi Axis Fiber（M.A.F）とともに、シャフトがさまざまなスイングタイプに反応し、インパクトの安定性を保ちながらダウンスイング中のクラブの加速を促進します。これにより、スマッシュファクターが向上し、飛距離と精度の両面でショットのばらつきが抑えられます。',
        },
        { type: 'h3', text: 'モダンデザイン' },
        {
          type: 'p',
          text: 'コースで注目を集め、存在感を放つ、大胆でトレンド感のあるマットヴォーグデザイン。',
        },
      ],
    },
  },
  'wood-shaft': {
    en: {
      eyebrow: 'Wood Shaft',
      title: 'DARKNESS Series Wood Shaft',
      description:
        'The KAEN DARKNESS series wood shafts — four specifications engineered for players from recreational to professional.',
      lead: 'The KAEN “DARKNESS” series wood shafts come in four unique specifications to satisfy the wide range of performance demands, from recreational players to professionals.',
      figures: [{ src: '/legacy/wood-shaft/darkness-wood.avif', caption: 'KAEN DARKNESS wood shaft', wide: true }],
      blocks: [
        { type: 'h3', text: 'Quality' },
        {
          type: 'p',
          text: 'All KAEN Performance Composite (KPC) shafts are made from high-grade carbon fiber materials utilizing a special Carbon Fusion Technology to ensure specification and performance consistency. In addition, all shafts go through an in-house quality assurance test before reaching customers around the globe.',
        },
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: 'The KAEN “DARKNESS” series features a unique torque setting based on data gathered from professional fitters around the world. This optimal torque setting allows the shaft to react to various types of swings for tighter shot dispersion and consistent feel with every shot.',
        },
        { type: 'h3', text: 'Modern Design' },
        { type: 'p', text: 'The KAEN “DARKNESS” features a Matte Vogue finish for a bold and trendy look.' },
      ],
    },
    ja: {
      eyebrow: 'ウッドシャフト',
      title: 'DARKNESS シリーズ ウッドシャフト',
      description:
        'KAEN DARKNESS シリーズのウッドシャフト — アマチュアからプロまで、幅広いプレーヤーのために設計された 4 つのスペック。',
      lead: 'KAEN「DARKNESS」シリーズのウッドシャフトは、レクリエーションプレーヤーからプロまで、幅広いパフォーマンス要求に応える 4 つの独自スペックで展開します。',
      figures: [{ src: '/legacy/wood-shaft/darkness-wood.avif', caption: 'KAEN DARKNESS ウッドシャフト', wide: true }],
      blocks: [
        { type: 'h3', text: '品質' },
        {
          type: 'p',
          text: 'すべての KAEN Performance Composite（KPC）シャフトは、特別な Carbon Fusion Technology を用いた高グレードのカーボンファイバー素材で作られ、スペックとパフォーマンスの一貫性を確保しています。さらに、すべてのシャフトは世界中のお客様にお届けする前に社内品質保証テストを通過します。',
        },
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: 'KAEN「DARKNESS」シリーズは、世界中のプロフィッターから収集したデータに基づく独自のトルク設定を採用しています。この最適なトルク設定により、シャフトはさまざまなタイプのスイングに反応し、ショットのばらつきを抑え、一打ごとに安定した打感をもたらします。',
        },
        { type: 'h3', text: 'モダンデザイン' },
        { type: 'p', text: 'KAEN「DARKNESS」は、大胆でトレンド感のあるマットヴォーグ仕上げを採用しています。' },
      ],
    },
  },
  'darkness-fw-shaft': {
    en: {
      eyebrow: 'Fairway Wood',
      title: 'DKNS Fairway Wood Series',
      description:
        'The KAEN DKNS Fairway Wood series — inspired by the best-selling Darkness driver shaft, with Active Torque Technology and Multi Axis Fiber.',
      lead: 'Our brand-new DKNS Fairway Wood Series golf shaft is inspired by our best-selling Darkness driver shaft, featuring our latest Active Torque Technology (A.T.T) and Multi Axis Fiber (M.A.F) to maximize club acceleration while keeping impact stability off the turf in any condition.',
      heroImage: '/legacy/darkness-fw-shaft/hero.avif',
      figures: [
        { src: '/legacy/darkness-fw-shaft/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/darkness-fw-shaft/icon-maf.avif', caption: 'Multi Axis Fiber' },
        { src: '/legacy/darkness-fw-shaft/ember-shaft.avif', caption: 'DKNS Fairway Wood' },
        { src: '/legacy/darkness-fw-shaft/specs.avif', caption: 'FW Series — specifications', wide: true },
      ],
      blocks: [
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: 'Optimal torque setting based on data gathered from professional fitters across the world provides tighter shot dispersion and consistent feel with every shot. This makes the KAEN DARKNESS one of the most forgiving shafts in the world.',
        },
        { type: 'h3', text: 'Multi Axis Fiber (M.A.F)' },
        {
          type: 'p',
          text: 'Multi Axis Fiber construction maximizes club acceleration while keeping impact stability off the turf, holding accuracy in any condition.',
        },
      ],
    },
    ja: {
      eyebrow: 'フェアウェイウッド',
      title: 'DKNS フェアウェイウッドシリーズ',
      description:
        'KAEN DKNS フェアウェイウッドシリーズ — ベストセラーの Darkness ドライバーシャフトにインスパイアされ、Active Torque Technology と Multi Axis Fiber を搭載。',
      lead: '新しい DKNS フェアウェイウッドシリーズのゴルフシャフトは、ベストセラーの Darkness ドライバーシャフトにインスパイアされ、最新の Active Torque Technology（A.T.T）と Multi Axis Fiber（M.A.F）を搭載。あらゆるコンディションで、ターフからのインパクトの安定性を保ちながらクラブの加速を最大化します。',
      heroImage: '/legacy/darkness-fw-shaft/hero.avif',
      figures: [
        { src: '/legacy/darkness-fw-shaft/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/darkness-fw-shaft/icon-maf.avif', caption: 'Multi Axis Fiber' },
        { src: '/legacy/darkness-fw-shaft/ember-shaft.avif', caption: 'DKNS フェアウェイウッド' },
        { src: '/legacy/darkness-fw-shaft/specs.avif', caption: 'FW シリーズ — スペック', wide: true },
      ],
      blocks: [
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: '世界中のプロフィッターから収集したデータに基づく最適なトルク設定により、ショットのばらつきが抑えられ、一打ごとに安定した打感が得られます。これにより、KAEN DARKNESS は世界で最も寛容なシャフトの一つとなっています。',
        },
        { type: 'h3', text: 'Multi Axis Fiber（M.A.F）' },
        {
          type: 'p',
          text: 'Multi Axis Fiber 構造は、ターフからのインパクトの安定性を保ちながらクラブの加速を最大化し、あらゆるコンディションで精度を維持します。',
        },
      ],
    },
  },
  backpacks: {
    en: {
      eyebrow: 'Iron Shafts',
      title: 'KAEN Dagger Iron Shafts',
      description:
        'KAEN Dagger Air and Dagger Pro iron shafts — engineered for shaft flexibility and shot accuracy across all levels of golfer.',
      lead: 'The KAEN Dagger series signals a revolutionary high-performance shaft for irons and hybrids — aerodynamically designed with composite material and vigorous high-density fiber, produced through an automated high-tech manufacturing process for uniform output and consistent quality.',
      heroImage: '/legacy/backpacks/hero.avif',
      figures: [
        { src: '/legacy/backpacks/icon-hdc.avif', caption: 'High Density Core' },
        { src: '/legacy/backpacks/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/backpacks/specs.avif', caption: 'Dagger — specifications', wide: true },
      ],
      blocks: [
        { type: 'h2', text: 'Dagger Air Iron Shaft' },
        {
          type: 'p',
          text: 'KAEN DAGGER AIR features a mid-high ball flight, thanks to our High Density Fiber Composite Core (H.D.C) and Active Torque Technology (A.T.T), giving our engineers compatible performance in shaft flexibility and shot accuracy for all levels of golfer. The performance is the outcome of many years of study and research — from data collected through scientific analysis conducted with support from experienced playing professionals and certified club fitters.',
        },
        { type: 'h2', text: 'Dagger Pro Iron Shaft' },
        {
          type: 'p',
          text: 'Our KAEN Dagger Pro shaft is a revolutionary high-performance shaft for irons and hybrids. It is an aerodynamically designed shaft with composite material and vigorous high-density fiber, produced through an automated high-tech manufacturing process to ensure uniform output and consistent quality. The Dagger shaft comes in unique lengths meant to match the stringent, demanding requirements in tipping and kick point — to conform and satisfy the varying swing dynamics of social, amateur and professional golfers. Dagger is unparalleled in its class.',
        },
      ],
    },
    ja: {
      eyebrow: 'アイアンシャフト',
      title: 'KAEN Dagger アイアンシャフト',
      description:
        'KAEN Dagger Air および Dagger Pro アイアンシャフト — あらゆるレベルのゴルファーのために、しなやかさとショット精度を追求。',
      lead: 'KAEN Dagger シリーズは、アイアンとハイブリッドのための革新的な高性能シャフトです。コンポジット素材と強靭な高密度ファイバーを用いた空力設計で、自動化されたハイテク製造プロセスにより、均一な仕上がりと安定した品質を実現します。',
      heroImage: '/legacy/backpacks/hero.avif',
      figures: [
        { src: '/legacy/backpacks/icon-hdc.avif', caption: 'High Density Core' },
        { src: '/legacy/backpacks/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/backpacks/specs.avif', caption: 'Dagger — スペック', wide: true },
      ],
      blocks: [
        { type: 'h2', text: 'Dagger Air アイアンシャフト' },
        {
          type: 'p',
          text: 'KAEN DAGGER AIR は、High Density Fiber Composite Core（H.D.C）と Active Torque Technology（A.T.T）により、ミッドハイの弾道を実現します。これにより、あらゆるレベルのゴルファーに対して、しなやかさとショット精度において適合した性能を提供します。この性能は、経験豊富なプレーイングプロと認定クラブフィッターの協力のもと行われた科学的分析によって収集されたデータに基づく、長年の研究の成果です。',
        },
        { type: 'h2', text: 'Dagger Pro アイアンシャフト' },
        {
          type: 'p',
          text: 'KAEN Dagger Pro シャフトは、アイアンとハイブリッドのための革新的な高性能シャフトです。コンポジット素材と強靭な高密度ファイバーを用いた空力設計で、自動化されたハイテク製造プロセスにより、均一な仕上がりと安定した品質を確保します。Dagger シャフトは、ソーシャル、アマチュア、プロのゴルファーの多様なスイングダイナミクスに適合するよう、チッピングとキックポイントの厳しい要求に合わせた独自の長さで展開します。Dagger はそのクラスにおいて比類のない存在です。',
        },
      ],
    },
  },
  'fairway-wood-series': {
    en: {
      eyebrow: 'Hybrid',
      title: 'DKNS Hybrid Series',
      description:
        'The KAEN DKNS Hybrid series — High Density Fiber Core and Active Torque Technology for a higher ball flight that gets closer to the pin.',
      lead: 'Our brand-new DKNS Hybrid Series golf shaft is built with our High Density Fiber Core (H.D.C) materials together with our Active Torque Technology (A.T.T) — allowing our engineers to produce a unique shaft profile that maximizes accuracy, provides a higher ball flight, and gets you closer to the pin.',
      heroImage: '/legacy/fairway-wood-series/hero.avif',
      figures: [
        { src: '/legacy/fairway-wood-series/icon-hdc.avif', caption: 'High Density Core' },
        { src: '/legacy/fairway-wood-series/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/fairway-wood-series/specs.avif', caption: 'HB Series — specifications', wide: true },
      ],
      blocks: [
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: 'Optimal torque setting based on data gathered from professional fitters across the world provides tighter shot dispersion and consistent feel with every shot. This makes the KAEN DARKNESS one of the most forgiving shafts in the world.',
        },
        { type: 'h3', text: 'High Density Fiber Core (H.D.C)' },
        {
          type: 'p',
          text: 'High Density Fiber Core materials shape a unique profile that maximizes accuracy and delivers a higher ball flight.',
        },
      ],
    },
    ja: {
      eyebrow: 'ハイブリッド',
      title: 'DKNS ハイブリッドシリーズ',
      description:
        'KAEN DKNS ハイブリッドシリーズ — High Density Fiber Core と Active Torque Technology により、ピンに近づける高い弾道を実現。',
      lead: '新しい DKNS ハイブリッドシリーズのゴルフシャフトは、High Density Fiber Core（H.D.C）素材と Active Torque Technology（A.T.T）を組み合わせて構築されています。これにより、当社のエンジニアは、精度を最大化し、より高い弾道でピンに近づける独自のシャフトプロファイルを実現しました。',
      heroImage: '/legacy/fairway-wood-series/hero.avif',
      figures: [
        { src: '/legacy/fairway-wood-series/icon-hdc.avif', caption: 'High Density Core' },
        { src: '/legacy/fairway-wood-series/icon-att.avif', caption: 'Active Torque Technology' },
        { src: '/legacy/fairway-wood-series/specs.avif', caption: 'HB シリーズ — スペック', wide: true },
      ],
      blocks: [
        { type: 'h3', text: 'Active Torque Technology' },
        {
          type: 'p',
          text: '世界中のプロフィッターから収集したデータに基づく最適なトルク設定により、ショットのばらつきが抑えられ、一打ごとに安定した打感が得られます。これにより、KAEN DARKNESS は世界で最も寛容なシャフトの一つとなっています。',
        },
        { type: 'h3', text: 'High Density Fiber Core（H.D.C）' },
        {
          type: 'p',
          text: 'High Density Fiber Core 素材が、精度を最大化し、より高い弾道をもたらす独自のプロファイルを形成します。',
        },
      ],
    },
  },
};

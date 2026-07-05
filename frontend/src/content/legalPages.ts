// Structured content for the long-form legal/policy pages, per locale.
// Text is transcribed verbatim from content/new-pages/others.md.
import type { Lang } from '../i18n/strings';

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string };

export interface ContentDoc {
  eyebrow: string;
  title: string;
  description: string;
  blocks: Block[];
}

export const LEGAL_PAGES: Record<string, Record<Lang, ContentDoc>> = {
  'shipping-returns': {
    en: {
      eyebrow: 'Policy',
      title: 'Shipping & Returns',
      description: 'KAEN shipping policy, processing times, returns, refunds and exchange terms.',
      blocks: [
        { type: 'h2', text: 'Shipping Policy' },
        {
          type: 'p',
          text: 'Thank you for visiting and shopping at Kaen golf website. Following are the terms and conditions that constitute our shipping policy.',
        },
        { type: 'h3', text: 'Shipping Processing Time' },
        {
          type: 'p',
          text: 'All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends and holidays.',
        },
        {
          type: 'p',
          text: 'If we are experiencing high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of your order, we will contact you via email.',
        },
        { type: 'h2', text: 'Return & Exchange Policy' },
        { type: 'h3', text: 'Returns' },
        {
          type: 'p',
          text: 'You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.',
        },
        { type: 'p', text: 'Your item needs to have the receipt or proof of purchase.' },
        { type: 'h3', text: 'Refunds' },
        {
          type: 'p',
          text: 'Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.',
        },
        {
          type: 'p',
          text: 'If your return is approved, we will initiate a refund to you by PayPal or any return payment channels that we could reach you.',
        },
        { type: 'h3', text: 'Shipping' },
        {
          type: 'p',
          text: 'You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of shipping will be deducted from your refund.',
        },
      ],
    },
    ja: {
      eyebrow: 'ポリシー',
      title: '配送と返品について',
      description: 'カエンゴルフの配送ポリシー、処理時間、返品、払い戻し、交換に関する規約。',
      blocks: [
        { type: 'h2', text: '配送ポリシー' },
        {
          type: 'p',
          text: 'カエンゴルフのウェブサイトにご訪問いただき、お買い物いただきありがとうございます。以下は当社の配送ポリシーを構成する利用規約です。',
        },
        { type: 'h3', text: '配送処理時間' },
        {
          type: 'p',
          text: 'すべての注文は2〜3営業日以内に処理されます。注文は週末と休日には発送または配達されません。',
        },
        {
          type: 'p',
          text: '注文が集中した場合、発送が数日遅れることがあります。配送にはさらに日数がかかりますのでご了承ください。ご注文の発送に大幅な遅れが生じる場合は、メールでご連絡いたします。',
        },
        { type: 'h2', text: '返品・交換ポリシー' },
        { type: 'h3', text: '返品' },
        {
          type: 'p',
          text: '商品を受け取った日から 30 日以内に返品してください。返品するには、商品が未使用で、受け取ったときと同じ状態である必要があります。',
        },
        { type: 'p', text: '商品には領収書または購入証明が必要です。' },
        { type: 'h3', text: '払い戻し' },
        {
          type: 'p',
          text: '返品された商品を受領後、検査を行い、返品を受領したことをお知らせします。商品の検査後、返金の状況を直ちにお知らせします。',
        },
        {
          type: 'p',
          text: '返品が承認された場合、PayPal または弊社がお客様に連絡できる返品支払いチャネルを通じて返金手続きを開始いたします。',
        },
        { type: 'h3', text: '配送' },
        {
          type: 'p',
          text: '商品を返品する際の送料はお客様のご負担となります。送料は返金されません。返金を受ける場合、返金額から送料が差し引かれます。',
        },
      ],
    },
  },
  'terms-conditions': {
    en: {
      eyebrow: 'Legal',
      title: 'Terms & Conditions',
      description: 'KAEN wholesale inquiries, privacy and safety terms and conditions.',
      blocks: [
        {
          type: 'p',
          text: 'I’m a wholesale inquiries section. I’m a great place to inform other retailers about how they can sell your stunning products. Use plain language and give as much information as possible in order to promote your business and take it to the next level!',
        },
        {
          type: 'p',
          text: 'I’m the second paragraph in your Wholesale Inquiries section. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add details about your policy and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.',
        },
        { type: 'h2', text: 'Privacy & Safety' },
        {
          type: 'p',
          text: 'I’m a Privacy & Safety policy section. I’m a great place to inform your customers about how you use, store, and protect their personal information. Add details such as how you use third-party banking to verify payment, the way you collect data or when will you contact users after their purchase was completed successfully.',
        },
        {
          type: 'p',
          text: 'Your user’s privacy is of the highest importance to your business, so take the time to write an accurate and detailed policy. Use straightforward language to gain their trust and make sure they keep coming back to your site!',
        },
      ],
    },
    ja: {
      eyebrow: '規約',
      title: '利用規約',
      description: 'カエンゴルフの卸売りに関するお問い合わせ、プライバシーと安全に関する利用規約。',
      blocks: [
        {
          type: 'p',
          text: '卸売りのお問い合わせセクションです。他の小売業者に、あなたの素晴らしい製品を販売する方法を知らせるのに最適な場所です。わかりやすい言葉を使い、できるだけ多くの情報を提供して、あなたのビジネスを促進し、次のレベルに進めましょう。',
        },
        {
          type: 'p',
          text: '私は卸売りのお問い合わせセクションの 2 番目の段落です。ここをクリックして独自のテキストを追加し、編集してください。簡単です。[テキストの編集] をクリックするか、ダブルクリックしてポリシーの詳細を追加し、フォントを変更します。ストーリーを伝え、ユーザーにあなたのことをもう少し知ってもらうのに最適な場所です。',
        },
        { type: 'h2', text: 'プライバシーと安全性' },
        {
          type: 'p',
          text: 'プライバシーと安全に関するポリシーのセクションです。個人情報をどのように使用、保存、保護するかについて顧客に知らせるのに最適な場所です。サードパーティの銀行を利用して支払いを確認する方法、データを収集する方法、購入が正常に完了した後にユーザーに連絡するタイミングなどの詳細を追加します。',
        },
        {
          type: 'p',
          text: 'ユーザーのプライバシーはビジネスにとって最も重要なので、正確で詳細なポリシーを時間をかけて作成してください。わかりやすい言葉を使ってユーザーの信頼を獲得し、ユーザーがサイトに繰り返し戻ってくるようにしてください。',
        },
      ],
    },
  },
};

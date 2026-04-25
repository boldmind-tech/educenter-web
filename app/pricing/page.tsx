
import { PricingContent } from '@boldmind-tech/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — EduCenter',
  description:
    'Simple, affordable pricing for JAMB, WAEC & NECO exam prep, digital business courses, and AI tools training. Free tier available.',
  openGraph: {
    title: 'EduCenter Pricing — Exam Prep & Digital Skills',
    description: 'Start free. Upgrade to Pro for ₦3,000/month.',
    url: 'https://educenter.com.ng/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="flex-1">
      <PricingContent
        productSlug="educenter"
        heading="Simple Pricing for Nigerian Students"
        subheading="From free JAMB practice to full business & AI mastery — pick the plan that fits where you are."
      />
    </main>
  );
}
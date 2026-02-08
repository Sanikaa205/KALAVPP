import Link from "next/link";
import { ShoppingCart, Palette, Package, Users, CreditCard, MessageCircle } from "lucide-react";

const FAQ_SECTIONS = [
  {
    icon: ShoppingCart,
    title: "Shopping",
    questions: [
      { q: "How do I place an order?", a: "Browse our shop, add items to your cart, and proceed to checkout. You can pay using various methods including UPI, cards, and COD." },
      { q: "Can I track my order?", a: "Yes, go to Dashboard > Orders to see real-time status updates for all your orders." },
      { q: "What is your return policy?", a: "Physical products can be returned within 7 days of delivery if damaged or not as described. Digital products are non-refundable." },
    ],
  },
  {
    icon: Palette,
    title: "Commissions",
    questions: [
      { q: "How do commissions work?", a: "Browse our services, select an artist, and submit a commission request with your requirements and budget. The artist will review and accept or discuss modifications." },
      { q: "Can I request revisions?", a: "Yes, most services include a set number of revisions. You can request revisions through your dashboard." },
    ],
  },
  {
    icon: Users,
    title: "Vendor FAQ",
    questions: [
      { q: "How do I become a vendor?", a: "Click 'Sell on KALAVPP' in the navigation and complete the vendor registration form. Your application will be reviewed by our team." },
      { q: "What are the fees?", a: "KALAVPP charges a small platform commission on each sale. Details are provided during vendor onboarding." },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and Cash on Delivery for eligible orders." },
      { q: "Is my payment information secure?", a: "Yes, all payments are processed through secure, encrypted channels. We do not store your card details." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">Help Center</h1>
      <p className="text-stone-600 mb-8">Find answers to commonly asked questions below.</p>

      <div className="space-y-8">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-lg border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2 mb-4">
              <section.icon className="h-5 w-5 text-amber-600" /> {section.title}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq) => (
                <div key={faq.q}>
                  <p className="text-sm font-medium text-stone-900">{faq.q}</p>
                  <p className="text-sm text-stone-600 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <MessageCircle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-stone-900">Still need help?</p>
        <p className="text-sm text-stone-600 mt-1">Our support team is here to help.</p>
        <Link href="/contact" className="mt-3 inline-block px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-md hover:bg-stone-800">
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-6">Privacy Policy</h1>
      <div className="prose prose-stone max-w-none text-sm text-stone-600 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, shipping address, and payment details. We also collect usage data including browsing history, search queries, and device information.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">How We Use Your Information</h2>
          <p>We use your information to process orders, manage your account, improve our services, send order updates, and personalize your experience. We never sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Data Security</h2>
          <p>We implement industry-standard security measures including encryption, secure payment processing, and regular security audits to protect your data.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Cookies</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. You can manage your account settings or contact us for data-related requests.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Contact</h2>
          <p>For privacy-related inquiries, contact us at privacy@kalavpp.com.</p>
        </section>
      </div>
    </div>
  );
}

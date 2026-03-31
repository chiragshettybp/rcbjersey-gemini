import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Privacy Policy</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <Section title="Information We Collect">
          <p>We collect basic customer information such as:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Shipping address</li>
          </ul>
        </Section>
        <Section title="How We Use Information">
          <p>Your data is used strictly for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Order processing</li>
            <li>Delivery coordination</li>
            <li>Customer communication</li>
          </ul>
          <p className="mt-2">We may contact you via WhatsApp, SMS, or email regarding your order.</p>
        </Section>
        <Section title="Data Sharing">
          <p>We do not sell or rent your personal data.</p>
          <p>Your information is only shared with trusted shipping partners for order delivery.</p>
        </Section>
        <Section title="Payment Security">
          <p>All payments are processed through secure methods.</p>
          <p>We do not store any sensitive payment details such as card information.</p>
        </Section>
        <Section title="Cookies">We use cookies to improve user experience and remember preferences.</Section>
        <Section title="User Rights">You may request access, correction, or deletion of your data by contacting our support team.</Section>
        <Section title="Policy Acceptance">By using our website, you consent to this Privacy Policy.</Section>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

export default PrivacyPage;

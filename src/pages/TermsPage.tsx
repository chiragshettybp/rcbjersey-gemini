import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Terms & Conditions</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <Section title="Agreement to Terms">By accessing and using this website, you agree to all our policies including Shipping, Payment, Return & Exchange, and Privacy Policy.</Section>
        <Section title="Eligibility">You must be at least 18 years old or accessing the website under parental supervision.</Section>
        <Section title="Orders & Acceptance">
          <p>All orders are subject to verification and acceptance.</p>
          <p>We reserve the right to cancel or refuse any order at our discretion.</p>
          <p className="mt-2 font-semibold text-foreground">Once an order is confirmed and processed, it cannot be cancelled or modified.</p>
        </Section>
        <Section title="Personalized Products">
          <p>All products are custom-made based on customer inputs (name, number, etc.).</p>
          <p>Such products cannot be cancelled, returned, or resold.</p>
        </Section>
        <Section title="Product Representation">
          <p>We strive to display accurate product images. However:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Colors may slightly vary due to screen settings</li>
            <li>Final prints may differ slightly from Instagram posts or sample images</li>
          </ul>
          <p className="mt-2">These variations are normal and not considered defects.</p>
        </Section>
        <Section title="Limitation of Liability">
          <p>We are not liable for delays, damages, or failures caused by:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Courier services</li>
            <li>Natural events</li>
            <li>External factors beyond our control</li>
          </ul>
        </Section>
        <Section title="User Responsibility">Customers are responsible for providing accurate order details. We are not responsible for errors made during order submission.</Section>
        <Section title="Policy Acceptance">By placing an order, you confirm that you have read, understood, and agreed to all policies.</Section>
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

export default TermsPage;

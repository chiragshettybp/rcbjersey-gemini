import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShippingPolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Shipping Policy</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <Section title="Shipping Charges">We offer flat shipping of ₹79 across India. No minimum order required.</Section>
        <Section title="Processing Time">All products are made-to-order. Once your order is confirmed and payment is received, processing takes 3–5 business days.</Section>
        <Section title="Delivery Time">After dispatch, delivery typically takes 3–12 business days depending on your location.</Section>
        <Section title="Tracking Details">Tracking information will be shared via WhatsApp once your order is shipped.</Section>
        <Section title="Delays">
          <p>While we aim for timely delivery, delays may occur due to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>High order volume</li>
            <li>Courier partner delays</li>
            <li>Weather or unforeseen circumstances</li>
          </ul>
          <p className="mt-2">Such delays are beyond our control, but we will always assist you with tracking and updates.</p>
        </Section>
        <Section title="Customer Acknowledgement">By placing an order, you agree to the processing and delivery timelines mentioned above.</Section>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-2"><h2 className="text-base font-bold text-foreground">{title}</h2><div className="text-muted-foreground">{children}</div></div>;
}

export default ShippingPolicyPage;

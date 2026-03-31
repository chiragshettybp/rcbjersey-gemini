import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentPolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Payment Policy</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <Section title="Prepaid Orders Only">We operate on a prepaid-only model. Cash on Delivery (COD) is not available.</Section>
        <Section title="Why Prepaid?">All our products are custom-made and personalized. Prepayment ensures order commitment and immediate processing.</Section>
        <Section title="Order Process">
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Place your order on the website</li>
            <li>Our team will contact you for confirmation</li>
            <li>Complete payment via UPI, Bank Transfer, or Card</li>
            <li>Your order enters production</li>
          </ol>
        </Section>
        <Section title="Payment Confirmation">
          <p>Orders are processed only after payment confirmation.</p>
          <p>You will receive confirmation via WhatsApp or email.</p>
        </Section>
        <Section title="Refund Policy">
          <p>As all products are personalized:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Refunds are not applicable</li>
            <li>Returns are not accepted</li>
          </ul>
          <p className="mt-2">In case of a verified issue, resolution will be provided as per our Return & Exchange Policy.</p>
        </Section>
        <Section title="Fraud Prevention">We reserve the right to cancel suspicious or fraudulent orders.</Section>
        <Section title="Customer Agreement">By completing payment, you agree to all policies and confirm that the order details provided are correct.</Section>
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

export default PaymentPolicyPage;

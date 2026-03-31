import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReturnsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Return & Exchange Policy</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <Section title="Custom-Made Products">
          <p>All our jerseys are made-to-order and personalized with your selected name and number. Because of this, each product is uniquely created for you after your order is placed.</p>
        </Section>
        <Section title="No Returns or Exchanges">
          <p className="font-semibold text-foreground">Due to the personalized nature of our products, we do not accept returns, exchanges, or cancellations once the order is confirmed.</p>
          <p className="mt-2">This policy is in place because the product cannot be resold or reused.</p>
        </Section>
        <Section title="Quality Assurance">
          <p>We follow a strict multi-step quality check before dispatch:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Verification of name and number as per your order</li>
            <li>Inspection for print quality and finishing</li>
            <li>Final packaging check before shipment</li>
          </ul>
          <p className="mt-2">This ensures that every product is delivered in proper condition.</p>
        </Section>
        <Section title="Damage or Issue Claims">
          <p>In rare cases of a genuine issue, customers must:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Contact us within 24–48 hours of delivery</li>
            <li>Provide clear photo/video proof</li>
          </ul>
          <p className="mt-2">All claims are subject to verification.</p>
        </Section>
        <Section title="Important Clarifications">
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Slight color or print variation may occur due to lighting, screen differences, or printing process</li>
            <li>These are not considered defects</li>
          </ul>
        </Section>
        <Section title="Customer Agreement">
          <p>By placing an order, you fully agree to this policy and all related terms.</p>
          <p className="mt-2">We appreciate your trust in choosing a personalized product.</p>
        </Section>
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

export default ReturnsPage;

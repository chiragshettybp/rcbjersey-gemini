import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: "Is Cash on Delivery available?",
    a: "No, we only accept prepaid orders."
  },
  {
    q: "Why prepaid only?",
    a: "Because each jersey is custom-made and cannot be resold."
  },
  {
    q: "Can I cancel my order?",
    a: "No, once confirmed, orders cannot be cancelled."
  },
  {
    q: "Can I return my product?",
    a: "No, personalized products are non-returnable."
  },
  {
    q: "What if I receive a wrong item?",
    a: "All products go through strict quality checks before dispatch."
  },
  {
    q: "How long does delivery take?",
    a: "3–12 business days after dispatch."
  },
  {
    q: "Will I get tracking details?",
    a: "Yes, tracking will be shared via WhatsApp."
  }
];

const FAQPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Frequently Asked Questions</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-4">
              <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQPage;

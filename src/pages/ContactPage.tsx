import { ArrowLeft, Mail, MessageCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const ContactPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    const msg = `Hi, I'm ${form.name} (${form.email}). ${form.message}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
    toast({ title: 'Opening WhatsApp...', description: 'Send us your message there!' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">Contact Us</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div className="text-sm text-muted-foreground space-y-2">
          <h2 className="text-base font-bold text-foreground">Need help with your order?</h2>
          <p>We’re here to assist you with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Order status & tracking</li>
            <li>Payment assistance</li>
            <li>Customization queries</li>
            <li>General support</li>
          </ul>
          <p className="pt-2">Contact us via WhatsApp or Email.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="text-xs text-muted-foreground">support@rcbjersey.com</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span><strong>Response Time:</strong> We typically respond within 24 hours. Customer Support is our priority, and we aim to provide quick and reliable assistance.</span>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Send a Message</h2>
          <Input placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="h-10 text-sm" />
          <Input placeholder="Your Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} inputMode="email" className="h-10 text-sm" />
          <Textarea placeholder="How can we help?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="text-sm min-h-[80px]" />
          <Button type="submit" className="w-full h-10 text-xs font-bold uppercase tracking-wider">
            <MessageCircle className="h-4 w-4 mr-2" /> Send via WhatsApp
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-card mt-8">
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="space-y-2">
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Policies</h3>
          <FooterLink to="/terms">Terms & Conditions</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/payment">Payment Policy</FooterLink>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Shipping</h3>
          <FooterLink to="/shipping">Shipping Policy</FooterLink>
          <FooterLink to="/returns">Returns & Exchange</FooterLink>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Support</h3>
          <FooterLink to="/contact">Contact Us</FooterLink>
          <FooterLink to="/faq">FAQs</FooterLink>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Social</h3>
          <a href="https://instagram.com/checkout" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">Shop</h3>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/cart">Cart</FooterLink>
        </div>
      </div>
      <div className="border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-left max-w-md mx-auto">
          <h4 className="font-bold text-foreground mb-1 uppercase tracking-wider">⚠️ Important Notice</h4>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>All products are personalized and made-to-order</li>
            <li>No returns, cancellations, or refunds</li>
            <li>Slight variations in color/print may occur</li>
            <li>Delivery timelines may vary during high demand</li>
          </ul>
          <p className="mt-2 font-medium">By placing an order, you agree to all store policies.</p>
        </div>
        <p className="mt-1">© {new Date().getFullYear()} RCB Jersey Store. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link to={to} className="block text-muted-foreground hover:text-foreground transition-colors">{children}</Link>;
}

export default Footer;

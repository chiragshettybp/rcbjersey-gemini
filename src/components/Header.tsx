import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Home, FileText, Shield, Truck, RotateCcw, CreditCard, Phone, HelpCircle, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/useCart';
import CartDrawer from '@/components/CartDrawer';
import { onCartOpen } from '@/lib/cartEvents';

const NAV_SECTIONS = [
  {
    label: 'Shop',
    links: [
      { to: '/', label: 'Home', icon: Home },
      { to: '/cart', label: 'Cart', icon: ShoppingCart },
    ],
  },
  {
    label: 'Policies',
    links: [
      { to: '/terms', label: 'Terms & Conditions', icon: FileText },
      { to: '/privacy', label: 'Privacy Policy', icon: Shield },
      { to: '/shipping', label: 'Shipping Policy', icon: Truck },
      { to: '/returns', label: 'Returns & Exchange', icon: RotateCcw },
      { to: '/payment', label: 'Payment Policy', icon: CreditCard },
    ],
  },
  {
    label: 'Support',
    links: [
      { to: '/contact', label: 'Contact Us', icon: Phone },
      { to: '/faq', label: 'FAQs', icon: HelpCircle },
    ],
  },
];

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { data: items } = useCart();
  const count = items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  useEffect(() => {
    const unsub = onCartOpen(() => setCartOpen(true));
    return () => { unsub(); };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-12 px-4">
          {/* Hamburger */}
          <Sheet open={navOpen} onOpenChange={setNavOpen}>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors" aria-label="Open menu">
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
                <SheetTitle className="text-base font-bold text-foreground tracking-tight flex items-center">
                  <img src="https://i.postimg.cc/XqBbYcyn/Photo-Room-20260320-221719.png" alt="RCB Jersey Store" className="h-6 object-contain" referrerPolicy="no-referrer" />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex-1 overflow-y-auto py-2">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label} className="px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                      {section.label}
                    </p>
                    {section.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setNavOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors group"
                      >
                        <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="flex-1">{link.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <img src="https://i.postimg.cc/XqBbYcyn/Photo-Room-20260320-221719.png" alt="RCB Jersey Store" className="h-8 object-contain" referrerPolicy="no-referrer" />
          </Link>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-muted transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;

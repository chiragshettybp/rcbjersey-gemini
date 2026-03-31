import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart, useClearCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useProduct';
import { useCreateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Lock, Truck, RotateCcw, Loader2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const ADDRESS_KEY = 'rcb_saved_address';

interface AddressForm {
  full_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyAddress: AddressForm = {
  full_name: '', phone: '', email: '', address_line1: '',
  address_line2: '', city: '', state: '', pincode: '',
};

function loadAddress(): AddressForm {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    if (raw) return { ...emptyAddress, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return emptyAddress;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get('buy_now') === 'true';

  const { data: cartItems, isLoading: cartLoading } = useCart();
  const { data: product } = useProduct();
  const createOrder = useCreateOrder();
  const clearCart = useClearCart();

  const [address, setAddress] = useState<AddressForm>(loadAddress);
  const [payment] = useState<'prepaid'>('prepaid');
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const buyNowItem = isBuyNow ? {
    product_id: searchParams.get('product_id') ?? '',
    size: searchParams.get('size') ?? '',
    quantity: parseInt(searchParams.get('quantity') ?? '1'),
    price: parseFloat(searchParams.get('price') ?? '0'),
    personalized_name: searchParams.get('name') ?? undefined,
    personalized_number: searchParams.get('number') ? parseInt(searchParams.get('number')!) : undefined,
  } : null;

  const items = isBuyNow && buyNowItem
    ? [buyNowItem]
    : (cartItems ?? []).map(c => ({
        product_id: c.product_id,
        size: c.size,
        quantity: c.quantity,
        price: c.price,
        personalized_name: c.personalized_name ?? undefined,
        personalized_number: c.personalized_number ?? undefined,
      }));

  const displayItems = isBuyNow && buyNowItem
    ? [{ ...buyNowItem, name: product?.name ?? 'RCB Jersey' }]
    : (cartItems ?? []).map(c => ({
        ...c,
        name: c.product?.name ?? 'RCB Jersey',
      }));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 79;
  const total = subtotal + shipping;

  useEffect(() => {
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(address));
  }, [address]);

  const updateField = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof AddressForm, string>> = {};
    if (!address.full_name.trim()) e.full_name = 'Required';
    if (!/^\d{10}$/.test(address.phone)) e.phone = '10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) e.email = 'Valid email required';
    if (!address.address_line1.trim()) e.address_line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = '6-digit PIN';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    setSubmitted(true);
    if (!validate()) return;
    if (!items.length) {
      toast({ title: 'Cart empty', description: 'Add items before checkout.', variant: 'destructive' });
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        items: items.map(i => ({
          product_id: i.product_id,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
          personalized_name: i.personalized_name,
          personalized_number: i.personalized_number,
        })),
        address: {
          ...address,
          address_line2: address.address_line2 || undefined,
        },
        total_amount: total,
      });

      if (!isBuyNow) {
        await clearCart.mutateAsync();
      }

      navigate(`/order-success?id=${order.id}`);
    } catch {
      toast({ title: 'Order failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  if (cartLoading && !isBuyNow) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-6 space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-2.5 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">Checkout</h1>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
            <Lock className="h-3 w-3" /> Secure
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-3">
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-3">
            {/* Shipping */}
            <section className="rounded-xl border border-border bg-card p-3.5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shipping Address</h2>
              <div className="grid gap-2.5 grid-cols-2">
                <Field label="Full Name" value={address.full_name} error={submitted ? errors.full_name : undefined}
                  onChange={v => updateField('full_name', v)} className="col-span-2" />
                <Field label="Phone" value={address.phone} error={submitted ? errors.phone : undefined}
                  onChange={v => updateField('phone', v.replace(/\D/g, '').slice(0, 10))} inputMode="tel" />
                <Field label="Email" value={address.email} error={submitted ? errors.email : undefined}
                  onChange={v => updateField('email', v)} inputMode="email" />
                <Field label="Address Line 1" value={address.address_line1} error={submitted ? errors.address_line1 : undefined}
                  onChange={v => updateField('address_line1', v)} className="col-span-2" />
                <Field label="Address Line 2 (Optional)" value={address.address_line2}
                  onChange={v => updateField('address_line2', v)} className="col-span-2" />
                <Field label="City" value={address.city} error={submitted ? errors.city : undefined}
                  onChange={v => updateField('city', v)} />
                <Field label="State" value={address.state} error={submitted ? errors.state : undefined}
                  onChange={v => updateField('state', v)} />
                <Field label="PIN Code" value={address.pincode} error={submitted ? errors.pincode : undefined}
                  onChange={v => updateField('pincode', v.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" />
              </div>
            </section>

            {/* Payment Info */}
            <section className="rounded-xl border border-destructive bg-destructive/5 p-3.5 space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-destructive">Payment</h2>
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-destructive" />
                  <p className="text-xs font-bold text-destructive">Only Prepaid Orders – No Cash on Delivery</p>
                </div>
                <p className="text-[11px] text-destructive/80 leading-relaxed font-medium">
                  Place your order now — our manager will contact you shortly for payment & order confirmation.
                </p>
              </div>
              <p className="text-[10px] text-destructive/70 italic">
                As each jersey is personalized & made-to-order, prepaid payment ensures commitment and smooth processing.
              </p>
            </section>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Button
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                className="w-full h-12 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                {createOrder.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Place Order — ₹{total.toLocaleString('en-IN')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-3 lg:sticky lg:top-14 lg:self-start">
            <section className="rounded-xl border border-border bg-card p-3.5 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Summary</h2>

              {displayItems.map((item, i) => (
                <div key={i} className="flex gap-2.5">
                  <img src={product?.images?.[0] || 'https://i.postimg.cc/R0G679pC/PUMA-x-RCB-2026-Men-s-Official-Match-Jersey.jpg'} alt="Jersey" className="w-12 h-14 object-contain rounded-lg bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">Size: {item.size} · Qty: {item.quantity}</p>
                    {(item.personalized_name || item.personalized_number) && (
                      <span className="inline-flex items-center gap-0.5 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                        🔥 {item.personalized_name} #{item.personalized_number}
                      </span>
                    )}
                    <p className="text-xs font-bold text-foreground">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}

              <div className="h-px bg-border" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-foreground">₹{shipping}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </section>

            {/* Delivery */}
            <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-2.5">
              <Truck className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Fast Delivery</p>
                <p className="text-[10px] text-muted-foreground">3–5 business days</p>
              </div>
            </div>

            {/* Trust */}
            <div className="flex items-center justify-center gap-4 py-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure</span>
              <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Fast Ship</span>
              <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" /> Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-4 py-2.5 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total</p>
            <p className="text-base font-bold text-foreground">₹{total.toLocaleString('en-IN')}</p>
          </div>
          <Button
            onClick={handlePlaceOrder}
            disabled={createOrder.isPending}
            className="h-11 px-6 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
          >
            {createOrder.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                 <Lock className="h-3.5 w-3.5 mr-1.5" />
                 Place Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

function Field({ label, value, error, onChange, className, inputMode }: {
  label: string; value: string; error?: string;
  onChange: (v: string) => void; className?: string;
  inputMode?: 'tel' | 'email' | 'numeric';
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode={inputMode}
        placeholder={label.replace(' (Optional)', '')}
        className={cn(
          'h-10 text-sm rounded-lg border transition-colors',
          error ? 'border-destructive' : 'border-input focus:border-primary/50'
        )}
      />
      {error && <p className="text-[10px] text-destructive font-medium">{error}</p>}
    </div>
  );
}

export default CheckoutPage;

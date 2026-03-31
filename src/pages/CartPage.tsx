import { useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Trash2, ArrowLeft, Lock, Truck, RotateCcw, Minus, Plus } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const subtotal = items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
  const shipping = 79;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-lg px-4 py-6 space-y-3">
          {[1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <ShoppingCart className="h-14 w-14 text-muted-foreground mb-3" />
        <h2 className="text-lg font-bold text-foreground mb-1">Your cart is empty</h2>
        <p className="text-xs text-muted-foreground mb-5">Add a personalized jersey to get started</p>
        <Button onClick={() => navigate('/')} size="sm" className="font-semibold">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-lg px-4 py-2.5 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">Cart ({items.length})</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-3 py-3 space-y-3">
        {items.map(item => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-3 flex gap-3">
            <img
              src={item.product?.images?.[0] || 'https://i.postimg.cc/R0G679pC/PUMA-x-RCB-2026-Men-s-Official-Match-Jersey.jpg'}
              alt="Jersey"
              className="w-16 h-20 object-contain rounded-lg bg-muted flex-shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-xs font-bold text-foreground truncate">
                {item.product?.name ?? 'RCB Jersey'}
              </h3>
              <p className="text-[11px] text-muted-foreground">Size: {item.size}</p>
              {(item.personalized_name || item.personalized_number !== null) && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                  🔥 {item.personalized_name} #{item.personalized_number}
                </span>
              )}
              <p className="text-sm font-bold text-foreground">₹{item.price.toLocaleString('en-IN')}</p>

              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => item.quantity > 1 && updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                    className="p-1.5 hover:bg-muted transition-colors rounded-l-lg active:scale-90"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3 text-foreground" />
                  </button>
                  <span className="px-2.5 text-xs font-semibold text-foreground">{item.quantity}</span>
                  <button
                    onClick={() => item.quantity < 5 && updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                    className="p-1.5 hover:bg-muted transition-colors rounded-r-lg active:scale-90"
                    disabled={item.quantity >= 5}
                  >
                    <Plus className="h-3 w-3 text-foreground" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors active:scale-90"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure</span>
          <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Fast Delivery</span>
          <span className="flex items-center gap-1"><RotateCcw className="h-3 w-3" /> Easy Returns</span>
        </div>

        {/* Desktop summary */}
        <div className="hidden lg:block rounded-xl border border-border bg-card p-4 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Summary</h3>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
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
          <Button
            onClick={() => navigate('/checkout')}
            className="w-full h-11 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-1"
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" />
            Secure Checkout
          </Button>
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
            onClick={() => navigate('/checkout')}
            className="h-11 px-6 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
          >
            <Lock className="h-3.5 w-3.5 mr-1.5" />
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

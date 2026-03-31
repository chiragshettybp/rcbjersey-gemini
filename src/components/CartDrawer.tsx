import { useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, Lock } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const subtotal = items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
  const count = items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const shipping = 79;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border">
          <SheetTitle className="text-sm font-bold text-foreground tracking-tight">
            Your Cart ({count})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !items?.length ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">Cart is empty</p>
            <p className="text-xs text-muted-foreground">Add a jersey to get started</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
              {items.map(item => (
                <div key={item.id} className="rounded-xl border border-border bg-card p-2.5 flex gap-2.5">
                  <img
                    src={item.product?.images?.[0] || 'https://i.postimg.cc/R0G679pC/PUMA-x-RCB-2026-Men-s-Official-Match-Jersey.jpg'}
                    alt="Jersey"
                    className="w-14 h-[70px] object-contain rounded-lg bg-muted flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      {item.product?.name ?? 'RCB Jersey'}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">Size: {item.size}</p>
                    {(item.personalized_name || item.personalized_number !== null) && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">
                        🔥 {item.personalized_name} #{item.personalized_number}
                      </span>
                    )}
                    <p className="text-xs font-bold text-foreground">₹{item.price.toLocaleString('en-IN')}</p>

                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => item.quantity > 1 && updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                          className="p-1 hover:bg-muted transition-colors rounded-l-md active:scale-90"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3 text-foreground" />
                        </button>
                        <span className="px-2 text-[10px] font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => item.quantity < 5 && updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          className="p-1 hover:bg-muted transition-colors rounded-r-md active:scale-90"
                          disabled={item.quantity >= 5}
                        >
                          <Plus className="h-3 w-3 text-foreground" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem.mutate(item.id)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors active:scale-90"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom checkout section */}
            <div className="border-t border-border px-4 py-3 space-y-2.5">
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
              <Button
                onClick={() => { onOpenChange(false); navigate('/checkout'); }}
                className="w-full h-11 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Checkout
              </Button>
              <button
                onClick={() => { onOpenChange(false); navigate('/cart'); }}
                className="w-full text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                View full cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

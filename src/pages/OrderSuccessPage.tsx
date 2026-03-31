import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Package, ArrowRight, MessageCircle, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function buildWhatsAppMessage(order: { id: string; addresses?: { full_name?: string; phone?: string; address_line1?: string; address_line2?: string; city?: string; pincode?: string; state?: string }[]; order_items?: { size?: string; personalized_name?: string; personalized_number?: number; quantity?: number }[]; total_amount: number }) {
  const addr = order.addresses?.[0];
  const items = order.order_items || [];
  
  let msg = `Hello, I want to confirm my order.\n\n`;
  msg += `🧾 Order ID: #${order.id.slice(0, 8).toUpperCase()}\n`;
  msg += `💰 Amount: ₹${order.total_amount.toLocaleString('en-IN')}\n\n`;
  
  msg += `📦 Delivery Address:\n`;
  msg += `Name: ${addr?.full_name ?? ''}\n`;
  msg += `Phone: ${addr?.phone ?? ''}\n`;
  msg += `Address: ${addr?.address_line1 ?? ''}${addr?.address_line2 ? ', ' + addr.address_line2 : ''}\n`;
  msg += `${addr?.city ?? ''} - ${addr?.pincode ?? ''}, ${addr?.state ?? ''}\n\n`;
  
  msg += `🛒 Order Items:\n`;
  items.forEach((item, index) => {
    msg += `${index + 1}. PUMA x RCB 2026 Premium Quality Match Jersey\n`;
    msg += `   Size: ${item.size} | Qty: ${item.quantity ?? 1}\n`;
    if (item.personalized_name) msg += `   Name: ${item.personalized_name}\n`;
    if (item.personalized_number != null) msg += `   Number: ${item.personalized_number}\n`;
  });
  
  return msg;
}

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(orderId ?? undefined);

  const handleWhatsApp = () => {
    if (!order) return;
    const msg = buildWhatsAppMessage(order);
    window.open(`https://wa.me/919483033921?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Skeleton className="h-56 w-full max-w-sm rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-5 text-center">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <CheckCircle2 className="h-16 w-16 text-primary relative" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-bold text-foreground">Order Confirmed! 🔥</h1>
          <p className="text-xs text-muted-foreground">You're officially part of the RCB family</p>
        </div>

        {/* Order details */}
        <div className="rounded-xl border border-border bg-card p-4 text-left space-y-2.5">
          {orderId && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono text-[11px] text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="text-primary font-semibold">Confirmed</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Delivery</span>
            <span className="font-medium text-foreground">3–5 business days</span>
          </div>
          {order && (
            <div className="flex justify-between text-xs font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {order?.order_items?.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
              <Package className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <div className="text-[11px] space-y-0.5">
                <p className="font-medium text-foreground">Size {item.size} · Qty {item.quantity}</p>
                {(item.personalized_name || item.personalized_number) && (
                  <p className="text-primary font-bold">
                    🔥 {item.personalized_name} #{item.personalized_number}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {order && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                ⚠️ Message us these details to confirm your order or else order will be cancelled.
              </p>
              <Button
                onClick={handleWhatsApp}
                className="w-full h-12 text-sm font-bold bg-[#25D366] hover:bg-[#128C7E] text-white gap-2"
              >
                <MessageCircle className="h-5 w-5" /> Message us in WhatsApp
              </Button>
            </div>
          )}
          {orderId && (
            <Button
              onClick={() => navigate(`/orders/${orderId}`)}
              variant="outline"
              className="w-full h-10 text-xs font-semibold"
            >
              Track Order <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
          <Button
            onClick={() => navigate('/')}
            className="w-full h-10 text-xs font-bold uppercase tracking-wider"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

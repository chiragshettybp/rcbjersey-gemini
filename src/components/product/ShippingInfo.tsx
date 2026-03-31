import { Truck, RotateCcw, Shield } from 'lucide-react';

export function ShippingInfo() {
  const items = [
    { icon: Truck, label: 'Fast Shipping Available', desc: 'On all prepaid orders' },
    { icon: RotateCcw, label: 'Free Returns', desc: '14-day return policy' },
    { icon: Shield, label: 'Authentic Product', desc: 'Official licensed merchandise' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ icon: Icon, label, desc }) => (
        <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl bg-muted/50">
          <Icon className="h-5 w-5 text-primary mb-1.5" />
          <p className="text-xs font-semibold text-foreground leading-tight">{label}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
        </div>
      ))}
    </div>
  );
}

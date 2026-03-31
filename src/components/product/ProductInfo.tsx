import { Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  price: number;
  originalPrice?: number;
  color: string;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  isToggling: boolean;
}

export function ProductInfo({ name, price, originalPrice = 1999, color, isWishlisted, onWishlistToggle, isToggling }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-bold leading-tight text-foreground lg:text-2xl" style={{ textWrap: 'balance' }}>
          {name}
        </h1>
        <button
          onClick={onWishlistToggle}
          disabled={isToggling}
          className={cn(
            'mt-1 flex-shrink-0 p-2 rounded-full transition-all duration-200 active:scale-90',
            isWishlisted
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          )}
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={cn('h-5 w-5', isWishlisted && 'fill-current')} />
          )}
        </button>
      </div>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-foreground">
          ₹{price.toLocaleString('en-IN')}
        </span>
        <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{Math.round((1 - price / originalPrice) * 100)}% OFF</span>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">Prices include GST</p>
    </div>
  );
}

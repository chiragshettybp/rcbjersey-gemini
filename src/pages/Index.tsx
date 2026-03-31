import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { SizeSelector } from '@/components/product/SizeSelector';
import { PersonalizationSection } from '@/components/product/PersonalizationSection';
import { DeliveryCheck } from '@/components/product/DeliveryCheck';
import { ShippingInfo } from '@/components/product/ShippingInfo';
import { DispatchSlider } from '@/components/product/DispatchSlider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Heart, Zap, ShoppingCart, Lock, Truck, RotateCcw } from 'lucide-react';
import jerseyFront from '@/assets/jersey-front.png';
import jerseyBack from '@/assets/jersey-back.png';

const LOCAL_IMAGES = [jerseyFront, jerseyBack, jerseyFront, jerseyBack];

const Index = () => {
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct();
  const addToCart = useAddToCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [persName, setPersName] = useState('');
  const [persNumber, setPersNumber] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const [persError, setPersError] = useState(false);

  const { isWishlisted, toggle: toggleWishlist, isToggling } = useWishlist(
    product?.id ?? ''
  );

  const handleAddToCart = () => {
    let hasError = false;

    if (!selectedSize) {
      setSizeError(true);
      hasError = true;
    }

    // Personalization is always optional — plain jersey can be ordered

    if (hasError) return;

    const finalPrice = 999;
    addToCart.mutate({
      product_id: product!.id,
      size: selectedSize!,
      price: finalPrice,
      personalized_name: persName ? persName : undefined,
      personalized_number: persNumber ? parseInt(persNumber) : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-foreground">Failed to load product</p>
          <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4">
        <p className="text-xs font-semibold tracking-wide uppercase">
          Fast Shipping Available 🚚
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-3 py-3 lg:px-4 lg:py-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery
              images={LOCAL_IMAGES}
              personalization={{ name: persName, number: persNumber }}
            />
          </div>

          {/* Right: Product Details — sticky on desktop */}
          <div className="lg:sticky lg:top-6 lg:self-start space-y-5">
            <ProductInfo
              name={product.name}
              price={999}
              originalPrice={1999}
              color={product.color}
              isWishlisted={isWishlisted}
              onWishlistToggle={toggleWishlist}
              isToggling={isToggling}
            />

            <div className="h-px bg-border" />

            <PersonalizationSection
              productId={product.id}
              name={persName}
              number={persNumber}
              error={persError}
            />

            <div className="h-px bg-border" />

            <SizeSelector
              sizes={product.available_sizes}
              selected={selectedSize}
              onSelect={s => { setSelectedSize(s); setSizeError(false); }}
              error={sizeError}
            />

            {/* Desktop Add to Cart + Buy Now */}
            <div className="hidden lg:flex flex-col gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="w-full h-13 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                {addToCart.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  if (!selectedSize) { setSizeError(true); return; }
                  const params = new URLSearchParams({
                    buy_now: 'true',
                    product_id: product.id,
                    size: selectedSize,
                    price: '999',
                    quantity: '1',
                  });
                  if (persName) params.set('name', persName.toUpperCase());
                  if (persNumber) params.set('number', persNumber);
                  navigate(`/checkout?${params.toString()}`);
                }}
                variant="secondary"
                className="w-full h-13 text-sm font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Urgency */}
            <p className="text-xs text-muted-foreground text-center">
              🔥 High demand — <span className="font-semibold text-primary">12 people</span> customized today
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 py-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Secure Payment</span>
              <span className="flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Fast Delivery</span>
              <span className="flex items-center gap-1"><RotateCcw className="h-3.5 w-3.5" /> Easy Returns</span>
            </div>

            <div className="h-px bg-border" />

            <DeliveryCheck />

            <ShippingInfo />

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Product Details</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DispatchSlider />

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={() => toggleWishlist()}
            disabled={isToggling}
            className="flex-shrink-0 p-3 rounded-xl border border-border bg-card transition-all active:scale-90"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
          </button>
          <Button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="flex-1 h-12 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            {addToCart.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart — ₹999
              </>
            )}
          </Button>
        </div>
      </div>
      
    </div>
  );
};

export default Index;

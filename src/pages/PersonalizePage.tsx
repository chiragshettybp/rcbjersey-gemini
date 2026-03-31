import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { useAddToCart } from '@/hooks/useCart';
import { SizeSelector } from '@/components/product/SizeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Loader2, Check, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import jerseyBackImg from '@/assets/jersey-back.png';
import jerseyFrontImg from '@/assets/jersey-front.png';

const STORAGE_KEY = 'rcb_personalization';

function loadSaved(productId: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.productId === productId) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveDraft(productId: string, name: string, number: string, size: string | null, quantity: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ productId, name, number, size, quantity }));
}

const PersonalizePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const addToCart = useAddToCart();

  const [persName, setPersName] = useState('');
  const [persNumber, setPersNumber] = useState('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [view, setView] = useState<'back' | 'front'>('back');
  const [submitted, setSubmitted] = useState(false);

  // Restore saved state
  useEffect(() => {
    if (product) {
      const saved = loadSaved(product.id);
      if (saved) {
        setPersName(saved.name || '');
        setPersNumber(saved.number || '');
        setSelectedSize(saved.size || null);
        setQuantity(saved.quantity || 1);
      }
    }
  }, [product]);

  // Auto-save
  useEffect(() => {
    if (product) {
      saveDraft(product.id, persName, persNumber, selectedSize, quantity);
    }
  }, [product, persName, persNumber, selectedSize, quantity]);

  const nameValid = persName.length > 0 && /^[a-zA-Z\s]+$/.test(persName);
  const numberValid = persNumber.length > 0 && /^\d{1,2}$/.test(persNumber) && parseInt(persNumber) <= 99;
  const canAdd = nameValid && numberValid && !!selectedSize;

  const handleAddToCart = () => {
    setSubmitted(true);
    if (!selectedSize) { setSizeError(true); return; }
    if (!canAdd) return;

    addToCart.mutate({
      product_id: product!.id,
      size: selectedSize,
      price: product!.price,
      personalized_name: persName.trim().toUpperCase(),
      personalized_number: parseInt(persNumber),
    }, {
      onSuccess: () => {
        localStorage.removeItem(STORAGE_KEY);
        navigate('/cart');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
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
          <p className="text-lg font-semibold text-foreground">Product not found</p>
          <Button onClick={() => navigate('/')} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  const jerseyImage = view === 'back' ? jerseyBackImg : jerseyFrontImg;

  return (
    <div className="min-h-screen bg-background pb-28 lg:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">Personalise Your Jersey</h1>
            <p className="text-xs text-muted-foreground truncate">{product.name}</p>
          </div>
          <span className="text-sm font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">

          {/* Left: Jersey Preview */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* View toggle */}
            <div className="flex justify-center gap-1 mb-3">
              {(['back', 'front'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all active:scale-95',
                    view === v
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Jersey container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted">
              <img
                src={jerseyImage}
                alt={`Jersey ${view} view`}
                className="h-full w-full object-contain transition-opacity duration-300"
              />

              {/* Personalization overlay — only on back view */}
              {view === 'back' && (persName || persNumber) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  {/* Number */}
                  {persNumber && (
                    <div
                      className="relative"
                      style={{ marginTop: '-2%' }}
                    >
                      <span
                        className="block font-black leading-none"
                        style={{
                          fontSize: 'clamp(5rem, 18vw, 14rem)',
                          fontFamily: "'Impact', 'Arial Black', sans-serif",
                          background: 'linear-gradient(180deg, #f5d97a 0%, #c9a841 40%, #dbb94e 60%, #f5d97a 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(2px 3px 0px rgba(30, 20, 0, 0.6)) drop-shadow(0px 6px 12px rgba(0,0,0,0.3))',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {persNumber}
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  {persName && (
                    <div
                      className="relative mt-1"
                      style={{ marginTop: persNumber ? '0.5%' : '8%' }}
                    >
                      <span
                        className="block font-bold uppercase tracking-[0.15em] leading-none text-center"
                        style={{
                          fontSize: 'clamp(1rem, 4.5vw, 3rem)',
                          fontFamily: "'Impact', 'Arial Black', sans-serif",
                          background: 'linear-gradient(180deg, #f5d97a 0%, #c9a841 50%, #f5d97a 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(1px 2px 0px rgba(30, 20, 0, 0.5))',
                        }}
                      >
                        {persName.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            {/* Product title */}
            <div>
              <h2 className="text-lg font-bold text-foreground">{product.name}</h2>
              <p className="text-xl font-bold text-foreground mt-1">₹{product.price.toLocaleString('en-IN')}</p>
            </div>

            <div className="h-px bg-border" />

            {/* Personalise inputs */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Personalise
              </h3>
              <div className="flex gap-3">
                {/* Name input */}
                <div className="flex-1 relative">
                  <Input
                    value={persName}
                    onChange={e => {
                      const v = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 12);
                      setPersName(v);
                    }}
                    placeholder="NAME"
                    maxLength={12}
                    className={cn(
                      'h-12 pr-10 uppercase font-semibold tracking-wider text-sm border-2 transition-colors',
                      submitted && !nameValid && persName.length === 0
                        ? 'border-destructive'
                        : nameValid
                        ? 'border-primary/40'
                        : 'border-border'
                    )}
                  />
                  {nameValid && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-4 w-4" style={{ color: 'hsl(142 71% 45%)' }} />
                    </div>
                  )}
                </div>

                {/* Number input */}
                <div className="w-24 relative">
                  <Input
                    value={persNumber}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setPersNumber(v);
                    }}
                    placeholder="NUMBER"
                    maxLength={2}
                    inputMode="numeric"
                    className={cn(
                      'h-12 pr-10 font-semibold text-sm text-center border-2 transition-colors',
                      submitted && !numberValid && persNumber.length === 0
                        ? 'border-destructive'
                        : numberValid
                        ? 'border-primary/40'
                        : 'border-border'
                    )}
                  />
                  {numberValid && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="h-4 w-4" style={{ color: 'hsl(142 71% 45%)' }} />
                    </div>
                  )}
                </div>
              </div>

              {submitted && (!nameValid || !numberValid) && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>
                    {!nameValid && !numberValid
                      ? 'Please enter name and number'
                      : !nameValid
                      ? 'Please enter a valid name (letters only)'
                      : 'Please enter a valid number (0–99)'}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Size */}
            <SizeSelector
              sizes={product.available_sizes}
              selected={selectedSize}
              onSelect={s => { setSelectedSize(s); setSizeError(false); }}
              error={sizeError}
            />

            <div className="h-px bg-border" />

            {/* Quantity */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Quantity
              </h3>
              <select
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
                className="h-11 w-20 rounded-lg border-2 border-border bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus:border-primary/40 transition-colors"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="hidden lg:flex flex-col gap-2 pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className={cn(
                  'w-full h-13 text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98]',
                  canAdd
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg'
                    : 'bg-muted text-muted-foreground'
                )}
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
                  if (!canAdd) { setSubmitted(true); if (!selectedSize) setSizeError(true); return; }
                  const params = new URLSearchParams({
                    buy_now: 'true',
                    product_id: product.id,
                    size: selectedSize!,
                    price: product.price.toString(),
                    quantity: quantity.toString(),
                    name: persName.trim().toUpperCase(),
                    number: persNumber,
                  });
                  localStorage.removeItem(STORAGE_KEY);
                  navigate(`/checkout?${params.toString()}`);
                }}
                className="w-full h-13 text-sm font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                Buy Now — ₹{product.price.toLocaleString('en-IN')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <select
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="h-12 w-16 rounded-xl border-2 border-border bg-card px-2 text-sm font-medium text-foreground"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <Button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className={cn(
              'flex-1 h-12 text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98]',
              canAdd
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {addToCart.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizePage;

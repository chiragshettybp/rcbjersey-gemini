import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
  personalization?: { name: string; number: string };
}

export function ImageGallery({ images, personalization }: Props) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasPersonalization = personalization && (personalization.name || personalization.number);

  // Sync scroll to selected thumbnail
  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: selected * width,
        behavior: 'smooth'
      });
    }
  }, [selected]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const newSelected = Math.round(scrollLeft / width);
      if (newSelected !== selected) {
        setSelected(newSelected);
      }
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Main image carousel */}
      <div className="relative w-full overflow-hidden rounded-xl bg-muted lg:rounded-2xl group">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, i) => (
            <div key={i} className="relative flex-[0_0_100%] min-w-full snap-center aspect-square lg:aspect-[3/4]">
              <img
                src={img}
                alt={`Product view ${i + 1}`}
                className="absolute inset-0 h-full w-full object-contain"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Personalization overlay */}
        {hasPersonalization && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-foreground/70 text-primary-foreground px-4 py-2 rounded-lg text-center backdrop-blur-sm">
              {personalization.name && (
                <p className="text-sm font-bold tracking-widest uppercase">{personalization.name}</p>
              )}
              {personalization.number && (
                <p className="text-3xl font-black leading-none">{personalization.number}</p>
              )}
            </div>
          </div>
        )}

        {/* Zoom button */}
        <button
          onClick={() => setZoomed(true)}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md transition-transform active:scale-95 hover:bg-card z-20"
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>

        {/* Desktop nav arrows */}
        <div className="absolute inset-y-0 left-0 hidden lg:flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {selected > 0 && (
            <button
              onClick={() => setSelected(s => s - 1)}
              className="ml-4 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md hover:bg-card active:scale-95 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 hidden lg:flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {selected < images.length - 1 && (
            <button
              onClick={() => setSelected(s => s + 1)}
              className="mr-4 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md hover:bg-card active:scale-95 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-card/60'
              )}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              'relative h-16 w-16 flex-shrink-0 snap-start overflow-hidden rounded-lg transition-all duration-200 lg:h-20 lg:w-20',
              i === selected
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'opacity-60 hover:opacity-100'
            )}
          >
            <img src={img} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Zoom modal */}
      <Dialog open={zoomed} onOpenChange={setZoomed}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 bg-card border-none shadow-none">
          <img
            src={images[selected]}
            alt="Zoomed view"
            className="w-full h-full object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

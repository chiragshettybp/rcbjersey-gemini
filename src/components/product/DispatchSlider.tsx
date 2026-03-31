import { useRef } from 'react';

const SLIDER_IMAGES = [
  'https://i.postimg.cc/yYNRvJ45/071af228-d206-4d92-8191-cd592d640575.jpg',
  'https://i.postimg.cc/FsKSDf5B/0ea75c91-4d31-4405-bc1e-ad25af45917b.jpg',
  'https://i.postimg.cc/wx2JXXPG/1f71aca7-a8a9-4bdc-9adf-22844d0ab81b.jpg',
  'https://i.postimg.cc/ncLm0sbN/81717af5-d1d9-453e-a123-d8b7448e8c6f.jpg',
  'https://i.postimg.cc/4N3cBKk0/821630bb-1c5c-409c-a149-19848da9501a.jpg',
];

export function DispatchSlider() {
  // Duplicate the images to create a seamless loop
  const duplicatedImages = [...SLIDER_IMAGES, ...SLIDER_IMAGES];

  return (
    <div className="mt-8 mb-4 lg:hidden overflow-hidden">
      <div className="px-4 mb-3">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Today Dispatching Orders</h2>
      </div>
      
      <div className="relative w-full">
        <div className="flex w-max animate-marquee gap-3 px-4 pb-4">
          {duplicatedImages.map((src, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-[200px] sm:w-[240px] aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-muted/30"
            >
              <img 
                src={src} 
                alt={`Dispatching order ${idx + 1}`} 
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

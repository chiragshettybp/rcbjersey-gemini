import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  available_sizes: string[];
  color: string;
  personalization_required: boolean;
  back_image: string | null;
}

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const query = supabase.from('products').select('*');
      const { data, error } = productId
        ? await query.eq('id', productId).single()
        : await query.limit(1).single();
      if (error) throw error;
      const product = data as Product;
      product.name = 'PUMA x RCB 2026 Premium Quality Match Jersey';
      product.price = 999;
      product.available_sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
      product.images = [
        'https://i.postimg.cc/R0G679pC/PUMA-x-RCB-2026-Men-s-Official-Match-Jersey.jpg',
        'https://i.postimg.cc/CKJBGYrh/PUMA-x-RCB-2026-Men-s-VK18-Official-Jersey.jpg',
        'https://i.postimg.cc/N0b96YCg/PUMA-x-RCB-2026-Men-s-VK18-Official-Jersey-(1).jpg',
        'https://i.postimg.cc/vmXgrM2b/PUMA-x-RCB-2026-Men-s-VK18-Official-Jersey-(2).jpg',
        'https://i.postimg.cc/yYNRvJ45/071af228-d206-4d92-8191-cd592d640575.jpg',
        'https://i.postimg.cc/FsKSDf5B/0ea75c91-4d31-4405-bc1e-ad25af45917b.jpg',
        'https://i.postimg.cc/wx2JXXPG/1f71aca7-a8a9-4bdc-9adf-22844d0ab81b.jpg',
        'https://i.postimg.cc/ncLm0sbN/81717af5-d1d9-453e-a123-d8b7448e8c6f.jpg',
        'https://i.postimg.cc/4N3cBKk0/821630bb-1c5c-409c-a149-19848da9501a.jpg'
      ];
      return product;
    },
  });
}

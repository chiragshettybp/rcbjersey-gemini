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
      return product;
    },
  });
}

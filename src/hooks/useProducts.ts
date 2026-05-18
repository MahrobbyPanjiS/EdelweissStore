import { useEffect, useState } from 'react';
import supabase from '../lib/supabaseClient';
import type { Product } from '../types/product';

export default function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (err) throw err;

      // Map database fields to frontend shape if necessary
      const mapped: Product[] = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        description: r.description,
        category: r.category,
        imageUrl: r.image_url || r.imageUrl || '',
        is_premium: r.is_premium || false,
        stats: r.stats || { durasi: r.durasi || '', kit: r.kit || '', kelebihan: r.kelebihan || '' }
      }));

      setProducts(mapped);
    } catch (e: any) {
      setError(e.message || String(e));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error, refresh: fetchProducts };
}

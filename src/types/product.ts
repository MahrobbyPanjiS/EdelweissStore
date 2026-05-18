export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Rank' | 'Item' | 'Kosmetik';
  imageUrl: string;
  is_premium?: boolean;
  stats: {
    durasi: string;
    kit: string;
    kelebihan: string;
  };
}

export type MaybeProducts = Product[] | null;

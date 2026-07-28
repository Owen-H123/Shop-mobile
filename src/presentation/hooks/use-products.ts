import { useCallback, useEffect, useState } from 'react';

import { productService } from '@/application/services/product.service';
import { Product } from '@/domain/entities/product';

type UseProductsResult = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    productService
      .getProducts()
      .then((result) => {
        if (!cancelled) setProducts(result);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los productos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { products, loading, error, refetch };
}

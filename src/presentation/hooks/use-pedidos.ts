import { useCallback, useState } from 'react';

import { pedidoService } from '@/application/services/pedido.service';
import { Pedido } from '@/domain/entities/pedido';

type UsePedidosResult = {
  pedidos: Pedido[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function usePedidos(): UsePedidosResult {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    pedidoService
      .getPedidos()
      .then(setPedidos)
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setLoading(false));
  }, []);

  return { pedidos, loading, error, refetch };
}

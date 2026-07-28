import { Pedido } from '@/domain/entities/pedido';

export type NuevoPedido = Omit<Pedido, 'id' | 'fechaRegistro'>;

export interface PedidoRepository {
  getAll(): Promise<Pedido[]>;
  getById(id: number): Promise<Pedido | null>;
  create(pedido: NuevoPedido): Promise<Pedido>;
  update(id: number, pedido: Partial<NuevoPedido>): Promise<Pedido>;
  delete(id: number): Promise<void>;
}

import { Pedido } from '@/domain/entities/pedido';
import { NuevoPedido, PedidoRepository } from '@/domain/repositories/pedido-repository';

export class UpdatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  execute(id: number, pedido: Partial<NuevoPedido>): Promise<Pedido> {
    return this.pedidoRepository.update(id, pedido);
  }
}

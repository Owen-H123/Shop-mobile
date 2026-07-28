import { Pedido } from '@/domain/entities/pedido';
import { NuevoPedido, PedidoRepository } from '@/domain/repositories/pedido-repository';

export class CreatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  execute(pedido: NuevoPedido): Promise<Pedido> {
    return this.pedidoRepository.create(pedido);
  }
}

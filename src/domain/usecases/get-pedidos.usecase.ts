import { Pedido } from '@/domain/entities/pedido';
import { PedidoRepository } from '@/domain/repositories/pedido-repository';

export class GetPedidosUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  execute(): Promise<Pedido[]> {
    return this.pedidoRepository.getAll();
  }
}

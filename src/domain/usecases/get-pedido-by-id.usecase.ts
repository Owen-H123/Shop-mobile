import { Pedido } from '@/domain/entities/pedido';
import { PedidoRepository } from '@/domain/repositories/pedido-repository';

export class GetPedidoByIdUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  execute(id: number): Promise<Pedido | null> {
    return this.pedidoRepository.getById(id);
  }
}

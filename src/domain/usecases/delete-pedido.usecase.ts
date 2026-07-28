import { PedidoRepository } from '@/domain/repositories/pedido-repository';

export class DeletePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  execute(id: number): Promise<void> {
    return this.pedidoRepository.delete(id);
  }
}

import { Pedido } from '@/domain/entities/pedido';
import { NuevoPedido, PedidoRepository } from '@/domain/repositories/pedido-repository';

/**
 * TODO: implementar contra SQLite (expo-sqlite) usando el cliente de
 * infrastructure/database. Por ahora solo define la forma del repositorio.
 */
export class PedidoSqliteRepository implements PedidoRepository {
  async getAll(): Promise<Pedido[]> {
    throw new Error('PedidoSqliteRepository.getAll: not implemented yet');
  }

  async getById(_id: number): Promise<Pedido | null> {
    throw new Error('PedidoSqliteRepository.getById: not implemented yet');
  }

  async create(_pedido: NuevoPedido): Promise<Pedido> {
    throw new Error('PedidoSqliteRepository.create: not implemented yet');
  }

  async update(_id: number, _pedido: Partial<NuevoPedido>): Promise<Pedido> {
    throw new Error('PedidoSqliteRepository.update: not implemented yet');
  }

  async delete(_id: number): Promise<void> {
    throw new Error('PedidoSqliteRepository.delete: not implemented yet');
  }
}

import { Pedido } from '@/domain/entities/pedido';
import { NuevoPedido, PedidoRepository } from '@/domain/repositories/pedido-repository';
import { getDatabase } from '@/infrastructure/database/sqlite-client';

export class PedidoSqliteRepository implements PedidoRepository {
  async getAll(): Promise<Pedido[]> {
    const db = await getDatabase();
    return db.getAllAsync<Pedido>('SELECT * FROM pedidos ORDER BY fechaRegistro DESC');
  }

  async getById(id: number): Promise<Pedido | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<Pedido>('SELECT * FROM pedidos WHERE id = ?', id);
    return row ?? null;
  }

  async create(pedido: NuevoPedido): Promise<Pedido> {
    const db = await getDatabase();
    const fechaRegistro = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO pedidos (clienteNombre, producto, cantidad, precio, estado, fechaRegistro) VALUES (?, ?, ?, ?, ?, ?)',
      pedido.clienteNombre,
      pedido.producto,
      pedido.cantidad,
      pedido.precio,
      pedido.estado,
      fechaRegistro,
    );
    return { id: result.lastInsertRowId, fechaRegistro, ...pedido };
  }

  async update(id: number, pedido: Partial<NuevoPedido>): Promise<Pedido> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error(`Pedido ${id} no encontrado`);
    }

    const updated = { ...current, ...pedido };
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE pedidos SET clienteNombre = ?, producto = ?, cantidad = ?, precio = ?, estado = ? WHERE id = ?',
      updated.clienteNombre,
      updated.producto,
      updated.cantidad,
      updated.precio,
      updated.estado,
      id,
    );
    return updated;
  }

  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM pedidos WHERE id = ?', id);
  }
}

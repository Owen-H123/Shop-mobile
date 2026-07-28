import { NuevoPedido } from '@/domain/repositories/pedido-repository';
import { CreatePedidoUseCase } from '@/domain/usecases/create-pedido.usecase';
import { DeletePedidoUseCase } from '@/domain/usecases/delete-pedido.usecase';
import { GetPedidoByIdUseCase } from '@/domain/usecases/get-pedido-by-id.usecase';
import { GetPedidosUseCase } from '@/domain/usecases/get-pedidos.usecase';
import { UpdatePedidoUseCase } from '@/domain/usecases/update-pedido.usecase';
import { PedidoSqliteRepository } from '@/infrastructure/repositories/pedido-sqlite.repository';

const pedidoRepository = new PedidoSqliteRepository();
const getPedidosUseCase = new GetPedidosUseCase(pedidoRepository);
const getPedidoByIdUseCase = new GetPedidoByIdUseCase(pedidoRepository);
const createPedidoUseCase = new CreatePedidoUseCase(pedidoRepository);
const updatePedidoUseCase = new UpdatePedidoUseCase(pedidoRepository);
const deletePedidoUseCase = new DeletePedidoUseCase(pedidoRepository);

export const pedidoService = {
  getPedidos: () => getPedidosUseCase.execute(),
  getPedidoById: (id: number) => getPedidoByIdUseCase.execute(id),
  createPedido: (pedido: NuevoPedido) => createPedidoUseCase.execute(pedido),
  updatePedido: (id: number, pedido: Partial<NuevoPedido>) => updatePedidoUseCase.execute(id, pedido),
  deletePedido: (id: number) => deletePedidoUseCase.execute(id),
};

export type EstadoPedido = 'PENDIENTE' | 'EN_PROCESO' | 'ENTREGADO' | 'CANCELADO';

export type Pedido = {
  id: number;
  clienteNombre: string;
  producto: string;
  cantidad: number;
  precio: number;
  estado: EstadoPedido;
  fechaRegistro: string;
};

export type RolUsuario = 'ADMIN' | 'VENDEDOR';

export type Usuario = {
  id: number;
  nombre: string;
  usuario: string;
  rol: RolUsuario;
};
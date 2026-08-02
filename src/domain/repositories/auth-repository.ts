import { Usuario } from '@/domain/entities/usuario';

export type Credenciales = {
  usuario: string;
  password: string;
};

export interface AuthRepository {
  /** Valida credenciales contra los usuarios locales. Devuelve null si no coinciden. */
  login(credenciales: Credenciales): Promise<Usuario | null>;
  /** Recupera la sesión activa (si el usuario ya había iniciado sesión antes). */
  getSesionActiva(): Promise<Usuario | null>;
  /** Cierra la sesión activa. */
  logout(): Promise<void>;
}
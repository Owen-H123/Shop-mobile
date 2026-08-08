import { Usuario } from '@/domain/entities/usuario';
import { AuthRepository, Credenciales } from '@/domain/repositories/auth-repository';
import { getDatabase } from '@/infrastructure/database/sqlite-client';
import { hashPassword } from '@/infrastructure/security/password-hasher';

type UsuarioRow = {
  id: number;
  nombre: string;
  usuario: string;
  password: string;
  salt: string | null;
  rol: 'ADMIN' | 'VENDEDOR';
};

function toUsuario(row: UsuarioRow): Usuario {
  return { id: row.id, nombre: row.nombre, usuario: row.usuario, rol: row.rol };
}

export class AuthSqliteRepository implements AuthRepository {
  async login({ usuario, password }: Credenciales): Promise<Usuario | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<UsuarioRow>(
      'SELECT * FROM usuarios WHERE usuario = ? COLLATE NOCASE',
      usuario.trim(),
    );

    if (!row || !row.salt) return null;

    const passwordHash = await hashPassword(password, row.salt);
    if (passwordHash !== row.password) return null;

    // Persistimos la sesión localmente para que se mantenga al reabrir la app.
    await db.runAsync(
      'INSERT INTO sesion (id, usuarioId) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET usuarioId = excluded.usuarioId',
      row.id,
    );

    return toUsuario(row);
  }

  async getSesionActiva(): Promise<Usuario | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<UsuarioRow>(
      `SELECT usuarios.* FROM sesion
       INNER JOIN usuarios ON usuarios.id = sesion.usuarioId
       WHERE sesion.id = 1`,
    );
    return row ? toUsuario(row) : null;
  }

  async logout(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('UPDATE sesion SET usuarioId = NULL WHERE id = 1');
  }
}
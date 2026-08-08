import * as SQLite from 'expo-sqlite';

import { USUARIOS_SEED } from '@/domain/constants/auth.constants';
import { generateSalt, hashPassword } from '@/infrastructure/security/password-hasher';

const DATABASE_NAME = 'shop-mobile.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Agrega la columna `salt` si la base ya existía de una versión previa sin hash. */
async function ensureSaltColumn(db: SQLite.SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(usuarios)');
  const tieneSalt = columns.some((column) => column.name === 'salt');
  if (!tieneSalt) {
    await db.execAsync('ALTER TABLE usuarios ADD COLUMN salt TEXT');
  }
}

async function seedUsuarios(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) as total FROM usuarios');
  if (row && row.total > 0) return;

  for (const usuario of USUARIOS_SEED) {
    const salt = await generateSalt();
    const passwordHash = await hashPassword(usuario.password, salt);
    await db.runAsync(
      'INSERT INTO usuarios (nombre, usuario, password, salt, rol) VALUES (?, ?, ?, ?, ?)',
      usuario.nombre,
      usuario.usuario,
      passwordHash,
      salt,
      usuario.rol,
    );
  }
}

/** Re-hashea usuarios sembrados en una versión anterior que guardaba el password en texto plano. */
async function rehashLegacyPlaintext(db: SQLite.SQLiteDatabase): Promise<void> {
  const legacyRows = await db.getAllAsync<{ id: number; usuario: string }>(
    'SELECT id, usuario FROM usuarios WHERE salt IS NULL',
  );

  for (const row of legacyRows) {
    const seed = USUARIOS_SEED.find((u) => u.usuario === row.usuario);
    if (!seed) continue;

    const salt = await generateSalt();
    const passwordHash = await hashPassword(seed.password, salt);
    await db.runAsync('UPDATE usuarios SET password = ?, salt = ? WHERE id = ?', passwordHash, salt, row.id);
  }
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS pedidos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clienteNombre TEXT NOT NULL,
          producto TEXT NOT NULL,
          cantidad INTEGER NOT NULL,
          precio REAL NOT NULL,
          estado TEXT NOT NULL,
          fechaRegistro TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          usuario TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          salt TEXT,
          rol TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sesion (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          usuarioId INTEGER,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
      `);

      await ensureSaltColumn(db);
      await seedUsuarios(db);
      await rehashLegacyPlaintext(db);
      return db;
    });
  }
  return dbPromise;
}
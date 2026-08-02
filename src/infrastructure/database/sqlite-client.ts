import * as SQLite from 'expo-sqlite';

import { USUARIOS_SEED } from '@/domain/constants/auth.constants';

const DATABASE_NAME = 'shop-mobile.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function seedUsuarios(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) as total FROM usuarios');
  if (row && row.total > 0) return;

  for (const usuario of USUARIOS_SEED) {
    await db.runAsync(
      'INSERT INTO usuarios (nombre, usuario, password, rol) VALUES (?, ?, ?, ?)',
      usuario.nombre,
      usuario.usuario,
      usuario.password,
      usuario.rol,
    );
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
          rol TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sesion (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          usuarioId INTEGER,
          FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
        );
      `);

      await seedUsuarios(db);
      return db;
    });
  }
  return dbPromise;
}
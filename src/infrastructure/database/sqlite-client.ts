import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'shop-mobile.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

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
      `);
      return db;
    });
  }
  return dbPromise;
}

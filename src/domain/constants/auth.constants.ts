/**
 * Credenciales locales para el login simulado del EF (Semana 9).
 * No hay backend de autenticación: las credenciales se guardan y validan
 * contra la base SQLite local, tal como permite la rúbrica
 * ("login simple, simulado o local").
 *
 * Usuarios de prueba para la sustentación:
 *   admin     / admin123    (Administrador)
 *   vendedor  / vendedor123 (Vendedor)
 */
export const USUARIOS_SEED = [
  { nombre: 'Administrador', usuario: 'admin', password: 'admin123', rol: 'ADMIN' },
  { nombre: 'Vendedor Demo', usuario: 'vendedor', password: 'vendedor123', rol: 'VENDEDOR' },
] as const;

export const AUTH_VALIDATION = {
  USUARIO_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6,
} as const;

export const AUTH_MESSAGES = {
  CAMPOS_VACIOS: 'Ingresa usuario y contraseña para continuar.',
  USUARIO_CORTO: `El usuario debe tener al menos ${AUTH_VALIDATION.USUARIO_MIN_LENGTH} caracteres.`,
  PASSWORD_CORTA: `La contraseña debe tener al menos ${AUTH_VALIDATION.PASSWORD_MIN_LENGTH} caracteres.`,
  CREDENCIALES_INVALIDAS: 'Usuario o contraseña incorrectos.',
  ERROR_INESPERADO: 'Ocurrió un error al iniciar sesión. Intenta nuevamente.',
} as const;
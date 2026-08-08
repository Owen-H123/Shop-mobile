import * as Crypto from 'expo-crypto';

/**
 * SHA-256 con salt por usuario. No es un KDF lento (no reemplaza bcrypt/argon2
 * en un backend real), pero elimina el texto plano y las rainbow tables
 * genéricas para el login local de esta app (sin backend de auth).
 */
export async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

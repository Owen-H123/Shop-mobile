import { useCallback, useEffect, useState } from 'react';

import { authService } from '@/application/services/auth.service';
import { AUTH_MESSAGES, AUTH_VALIDATION } from '@/domain/constants/auth.constants';
import { Usuario } from '@/domain/entities/usuario';

type UseAuthResult = {
  usuarioActual: Usuario | null;
  checkingSesion: boolean;
  submitting: boolean;
  error: string | null;
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [checkingSesion, setCheckingSesion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService
      .getSesionActiva()
      .then(setUsuarioActual)
      .catch(() => setUsuarioActual(null))
      .finally(() => setCheckingSesion(false));
  }, []);

  const login = useCallback(async (usuario: string, password: string) => {
    setError(null);

    const usuarioLimpio = usuario.trim();
    if (!usuarioLimpio || !password) {
      setError(AUTH_MESSAGES.CAMPOS_VACIOS);
      return false;
    }
    if (usuarioLimpio.length < AUTH_VALIDATION.USUARIO_MIN_LENGTH) {
      setError(AUTH_MESSAGES.USUARIO_CORTO);
      return false;
    }
    if (password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
      setError(AUTH_MESSAGES.PASSWORD_CORTA);
      return false;
    }

    setSubmitting(true);
    try {
      const usuarioValidado = await authService.login({ usuario: usuarioLimpio, password });
      if (!usuarioValidado) {
        setError(AUTH_MESSAGES.CREDENCIALES_INVALIDAS);
        return false;
      }
      setUsuarioActual(usuarioValidado);
      return true;
    } catch {
      setError(AUTH_MESSAGES.ERROR_INESPERADO);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUsuarioActual(null);
  }, []);

  return { usuarioActual, checkingSesion, submitting, error, login, logout };
}
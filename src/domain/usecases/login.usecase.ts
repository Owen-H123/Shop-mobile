import { Usuario } from '@/domain/entities/usuario';
import { AuthRepository, Credenciales } from '@/domain/repositories/auth-repository';

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(credenciales: Credenciales): Promise<Usuario | null> {
    return this.authRepository.login(credenciales);
  }
}
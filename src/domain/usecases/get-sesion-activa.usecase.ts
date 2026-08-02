import { Usuario } from '@/domain/entities/usuario';
import { AuthRepository } from '@/domain/repositories/auth-repository';

export class GetSesionActivaUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<Usuario | null> {
    return this.authRepository.getSesionActiva();
  }
}
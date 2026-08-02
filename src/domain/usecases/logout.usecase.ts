import { AuthRepository } from '@/domain/repositories/auth-repository';

export class LogoutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
import { Credenciales } from '@/domain/repositories/auth-repository';
import { GetSesionActivaUseCase } from '@/domain/usecases/get-sesion-activa.usecase';
import { LoginUseCase } from '@/domain/usecases/login.usecase';
import { LogoutUseCase } from '@/domain/usecases/logout.usecase';
import { AuthSqliteRepository } from '@/infrastructure/repositories/auth-sqlite.repository';

const authRepository = new AuthSqliteRepository();
const loginUseCase = new LoginUseCase(authRepository);
const getSesionActivaUseCase = new GetSesionActivaUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);

export const authService = {
  login: (credenciales: Credenciales) => loginUseCase.execute(credenciales),
  getSesionActiva: () => getSesionActivaUseCase.execute(),
  logout: () => logoutUseCase.execute(),
};
# Shop Mobile

App móvil (React Native + Expo Router + TypeScript) para gestión de pedidos de un
pequeño comercio, con login por rol (Administrador / Vendedor), catálogo de productos
consumido de una API pública y panel administrativo con métricas básicas.

## Caso de uso

- **Vendedor**: inicia sesión, consulta el catálogo de productos, crea/edita/elimina
  pedidos y ve el detalle de cada uno.
- **Administrador**: además de lo anterior, accede a un panel con totales de ventas,
  pedidos entregados y estado general de la operación.

La sesión se guarda localmente, así que la app recuerda al usuario logueado aunque se
cierre y se vuelva a abrir.

## Arquitectura

El proyecto sigue una arquitectura por capas dentro de `src/`:

```
src/
├── app/              # Rutas de Expo Router (file-based routing)
├── presentation/      # Screens, hooks de UI, componentes y estilos
├── application/       # Services que orquestan los casos de uso
├── domain/            # Entidades, contratos (repositories) y casos de uso
└── infrastructure/     # Implementaciones concretas: SQLite, API REST, seguridad
```

Regla de dependencia: `domain` no depende de nada; `application` depende de `domain`;
`infrastructure` implementa los contratos de `domain`; `presentation` consume
`application` a través de hooks. Cualquier SDK de terceros (base de datos, HTTP,
criptografía) vive en `infrastructure/`.

| Capa | Contenido | Ejemplos |
|---|---|---|
| `presentation` | Screens, hooks, componentes visuales | `screens/login-screen.tsx`, `hooks/use-auth.ts` |
| `application` | Services que ensamblan casos de uso | `services/pedido.service.ts` |
| `domain` | Entidades, interfaces de repositorio, casos de uso, constantes | `entities/pedido.ts`, `repositories/auth-repository.ts` |
| `infrastructure` | SQLite, cliente HTTP, seguridad | `database/sqlite-client.ts`, `api/http-client.ts`, `security/password-hasher.ts` |

### Persistencia

- **Pedidos y usuarios/sesión**: SQLite local (`expo-sqlite`), fuente de verdad única.
  Las contraseñas se guardan como hash SHA-256 con salt por usuario
  (`infrastructure/security/password-hasher.ts`), nunca en texto plano.
- **Productos**: se consumen en vivo desde [fakestoreapi.com](https://fakestoreapi.com)
  vía `axios` (`infrastructure/api/http-client.ts`).

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL de la API de productos (por defecto `https://fakestoreapi.com`) |

> Nota: la integración con Firebase (Auth, Firestore, Storage) está planificada pero
> aún no implementada — este README se actualizará con las variables `EXPO_PUBLIC_FIREBASE_*`
> cuando esa etapa esté lista.

## Instalación

Requisitos: Node.js LTS y npm.

```bash
npm install
cp .env.example .env
```

## Correr en desarrollo

```bash
npx expo start
```

Desde la terminal de Expo podés abrir la app en:

- Un dispositivo físico con [Expo Go](https://expo.dev/go)
- Un emulador Android (`npm run android`)
- Un simulador iOS (`npm run ios`, solo macOS)
- El navegador (`npm run web`)

Usuarios de prueba (ver `src/domain/constants/auth.constants.ts`):

| Usuario | Password | Rol |
|---|---|---|
| `admin` | `admin123` | Administrador |
| `vendedor` | `vendedor123` | Vendedor |

## Generar APK / AAB (EAS Build)

El proyecto usa [EAS Build](https://docs.expo.dev/build/introduction/). Pasos:

```bash
npx eas-cli login          # inicia sesión con tu cuenta de Expo
npx eas-cli build:configure # vincula el proyecto (crea el projectId en app.json/eas.json)
```

Luego, según lo que necesites:

```bash
# APK firmado para instalar directo en un dispositivo (perfil "preview")
npx eas-cli build -p android --profile preview

# AAB para subir a Google Play (perfil "production")
npx eas-cli build -p android --profile production
```

Los perfiles están definidos en `eas.json`. El build corre en la nube de Expo; al
finalizar te da un link para descargar el `.apk`/`.aab`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start` | Levanta el servidor de desarrollo de Expo |
| `npm run android` / `ios` / `web` | Abre la app en esa plataforma |
| `npm run lint` | Corre ESLint (`expo lint`) |
| `npm run reset-project` | Resetea a la plantilla en blanco de Expo (no usar en este proyecto) |

## Roadmap

Pendiente para cumplir la rúbrica completa:

- [ ] Firebase Authentication (fuente de verdad de auth, SQLite como caché de sesión)
- [ ] Firestore como destino de sincronización de pedidos, offline-first con `synced`/`firebaseId`
- [ ] Firebase Storage para evidencias/fotos de pedidos
- [ ] Indicadores de sincronización y banner de estado offline (NetInfo)

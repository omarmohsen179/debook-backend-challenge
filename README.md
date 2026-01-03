# Debook — Backend Coding Challenge (Node.js / NestJS)

Gracias por tu interés en Debook. Este challenge busca evaluar **criterio de ingeniería**.
Queremos ver cómo diseñas un backend **performante**, **mantenible** y **listo para escalar**.

## Contexto

En Debook estamos construyendo una red social alrededor de contenido (posts cortos). Necesitamos un flujo típico de app social: interacción + notificación + buen rendimiento.

## El reto

Implementa una funcionalidad de **interacción** sobre un recurso (por ejemplo: _like_ sobre un post/line) y un flujo de **notificación**.

### Requisitos mínimos

- **NestJS + TypeScript**
- **PostgreSQL** (con migraciones o estrategia clara de schema)
- **TypeORM** (o una alternativa equivalente, pero justifica)
- Al menos **2 endpoints**:
  1. Crear la interacción (ej. `POST /v1/posts/:id/like`)
  2. Obtener el recurso con **contadores** (ej. `GET /v1/posts/:id` devolviendo `likesCount` y otro contador que elijas)
- Debe existir alguna forma de **evitar duplicados** (ej. mismo usuario no puede dar like 2 veces).
- Debe existir un flujo de **notificación asíncrono** cuando ocurre una interacción (puede ser cola/evento/worker; decide tú cómo).
- **Performance**: evita soluciones que carguen relaciones completas para calcular contadores (queremos queries eficientes).
- **Tests**: al menos
  - 1 test unitario relevante (use case / service)
  - 1 test e2e del endpoint de interacción

> Puedes simplificar la autenticación (ej. header `x-user-id` o un guard mock). No hace falta auth real.

## Lo que valoramos (más que “features”)

- Arquitectura clara (controllers delgados, separación de capas, buen naming)
- Decisiones bien justificadas (trade-offs)
- Correctitud (idempotencia o manejo de repetidos, consistencia)
- Buen uso de Postgres (índices, constraints, queries)
- DX (README sencillo, scripts, docker, facilidad para correr)

## Entrega

- Repo con commits (ideal) o zip.
- Incluye:
  - `README` con cómo levantarlo y cómo probarlo
  - `.env.example`
  - `docker-compose.yml` si usas servicios (DB, redis, etc.)
  - Scripts tipo: `start`, `start:dev`, `test`, `test:e2e`

## Tiempo orientativo

No buscamos que sea enorme. Priorizamos **calidad y decisiones** antes que cantidad.

---

Si tienes dudas razonables, decide tú y explícitalo. Preferimos ver tu criterio antes que un challenge 100% guiado.
¡Suerte! 🚀

---

# 📖 Cómo Levantar el Proyecto

## Prerrequisitos

- **Docker Desktop** instalado y corriendo

> **Nota**: ¡Eso es todo! No necesitas instalar Node.js, npm, PostgreSQL ni ninguna otra dependencia. Todo corre dentro de Docker.

## 🚀 Inicio Rápido con Docker (Recomendado)

### ⭐ Un Solo Comando (Todo Automático)

Para un desarrollador nuevo, simplemente ejecuta:

```bash
cd backend
./run.sh
```

O usando npm:

```bash
cd backend
npm run setup && npm run test:all
```

Este comando automáticamente:
- ✅ Verifica que Docker esté corriendo
- ✅ Crea el archivo `.env` si no existe (desde `.env.example`)
- ✅ Construye las imágenes Docker (app y test)
- ✅ Inicia PostgreSQL y la aplicación
- ✅ Espera a que los servicios estén listos
- ✅ Espera a que las tablas de la base de datos se creen
- ✅ Ejecuta todos los tests **dentro de Docker** (unitarios, E2E y API)
- ✅ Verifica que todo funciona correctamente

**¡Eso es todo!** No necesitas configurar nada manualmente. Todo está automatizado y corre dentro de Docker.

> **Nota**: La primera vez puede tardar 2-3 minutos mientras descarga las imágenes de Docker y construye la aplicación. Los tests se ejecutan automáticamente al finalizar el setup, **todo dentro de contenedores Docker**.

**Resultado esperado:**
- ✅ 8 tests unitarios pasando (ejecutados en Docker)
- ✅ 6 tests E2E pasando (ejecutados en Docker)
- ✅ Todos los endpoints de API funcionando
- ✅ Aplicación corriendo en http://localhost:3000/v1

**Ventajas:**
- 🐳 **No necesitas Node.js instalado localmente**
- 🐳 **No necesitas npm instalado localmente**
- 🐳 **Todo corre en contenedores aislados**
- 🐳 **Mismo entorno en cualquier máquina**

### Opción 2: Setup Manual (Paso a Paso)

Si prefieres hacerlo paso a paso:

1. **Clonar y navegar al directorio backend**:
   ```bash
   cd backend
   ```

2. **Ejecutar el script de setup**:
   ```bash
   ./setup.sh
   ```
   
   O manualmente:
   ```bash
   # Copiar variables de entorno (se crea automáticamente si no existe)
   cp .env.example .env
   
   # Levantar la aplicación
   docker-compose up -d
   ```

3. **Verificar el estado**:
   ```bash
   docker-compose ps
   docker-compose logs -f app
   ```

4. **Ejecutar tests**:
   ```bash
   ./test-all.sh
   # o
   npm run test:all
   ```

La API estará disponible en `http://localhost:3000/v1` (verifica el puerto con `docker-compose ps`)

## 🛠️ Desarrollo Local (Sin Docker)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env y cambiar DATABASE_HOST=localhost
   ```

3. **Iniciar PostgreSQL** (con Docker o instalación local):
   ```bash
   docker run -d \
     --name debook-postgres \
     -e POSTGRES_USER=debook_user \
     -e POSTGRES_PASSWORD=debook_password \
     -e POSTGRES_DB=debook_db \
     -p 5432:5432 \
     postgres:15-alpine
   ```

4. **Ejecutar la aplicación**:
   ```bash
   npm run start:dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/v1
```

### Endpoints

#### 1. Obtener Post con Contadores

**GET** `/posts/:id`

Retorna un post con contadores eficientes de likes y comentarios.

**Respuesta**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "Este es un post de ejemplo",
  "authorId": "660e8400-e29b-41d4-a716-446655440000",
  "likesCount": 42,
  "commentsCount": 15,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Ejemplo**:
```bash
curl http://localhost:3001/v1/posts/550e8400-e29b-41d4-a716-446655440000
```

#### 2. Crear Like (Idempotente)

**POST** `/posts/:id/like`

Crea un like para un post. Es idempotente - retorna éxito incluso si el usuario ya dio like.

**Headers**:
- `x-user-id`: UUID del usuario (requerido, debe ser un UUID válido)

**Respuesta**:
```json
{
  "success": true,
  "message": "Like created successfully",
  "alreadyLiked": false
}
```

**Ejemplo**:
```bash
curl -X POST \
  http://localhost:3001/v1/posts/550e8400-e29b-41d4-a716-446655440000/like \
  -H "x-user-id: 770e8400-e29b-41d4-a716-446655440000"
```

**Respuestas de Error**:
- `401 Unauthorized`: Falta o es inválido el header `x-user-id`
- `404 Not Found`: El post no existe

> **Importante**: El `x-user-id` debe ser un UUID válido. Valores como "test-user-123" causarán errores.

## 🧪 Cómo Probar

### Opción 1: Todos los Tests Automáticamente ⭐ (Todo en Docker)

```bash
# Ejecutar todos los tests (unitarios, E2E y pruebas de API)
# TODO CORRE DENTRO DE DOCKER - NO NECESITAS NODE.JS LOCAL
./test-all.sh
```

Este script ejecuta **todo dentro de Docker**:
- ✅ Tests unitarios (en contenedor Docker)
- ✅ Tests E2E (en contenedor Docker)
- ✅ Pruebas de endpoints de la API
- ✅ Verificación de funcionalidades clave

**Ventajas:**
- 🐳 No necesitas Node.js instalado localmente
- 🐳 Mismo entorno en cualquier máquina
- 🐳 Aislamiento completo

### Opción 2: Tests Individuales (Dentro de Docker)

#### Ejecutar Tests Unitarios

```bash
# Ejecutar tests unitarios dentro de Docker
docker compose run --rm test npm test

# Ejecutar con cobertura
docker compose run --rm test npm run test:cov
```

#### Ejecutar Tests E2E

```bash
# Asegúrate de que PostgreSQL esté corriendo
docker compose up -d postgres

# Esperar a que la base de datos esté lista
sleep 5

# Ejecutar tests e2e dentro de Docker
docker compose run --rm test npm run test:e2e
```

**Nota**: Todos los tests se ejecutan dentro de contenedores Docker. No necesitas instalar Node.js, npm ni ninguna dependencia localmente.

## 🏗️ Arquitectura

### Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts                    # Punto de entrada de la aplicación
│   ├── app.module.ts              # Módulo raíz
│   ├── config/
│   │   └── database.config.ts     # Configuración TypeORM
│   ├── posts/
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts    # GET /v1/posts/:id
│   │   ├── posts.service.ts       # Lógica de negocio
│   │   ├── entities/
│   │   │   ├── post.entity.ts
│   │   │   └── comment.entity.ts
│   │   └── dto/
│   │       └── post-response.dto.ts
│   ├── likes/
│   │   ├── likes.module.ts
│   │   ├── likes.controller.ts    # POST /v1/posts/:id/like
│   │   ├── likes.service.ts       # Lógica de creación de likes
│   │   ├── likes.service.spec.ts    # Tests unitarios
│   │   ├── entities/
│   │   │   └── like.entity.ts
│   │   └── dto/
│   │       └── like-response.dto.ts
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── notifications.service.ts
│   │   └── listeners/
│   │       └── like-created.listener.ts
│   └── common/
│       ├── guards/
│       │   └── user-id.guard.ts   # Autenticación x-user-id
│       └── decorators/
│           └── current-user.decorator.ts
├── test/
│   ├── likes.e2e-spec.ts          # Tests E2E
│   └── jest-e2e.json
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🎯 Decisiones de Implementación Clave

### 1. Creación de Likes Idempotente

**Problema**: Los usuarios pueden hacer clic en like múltiples veces, causando entradas duplicadas.

**Solución**: 
- Constraint UNIQUE a nivel de base de datos en `(postId, userId)`
- Capturar error de violación de constraint único (código PostgreSQL `23505`)
- Retornar respuesta de éxito incluso si el like ya existe

**Rationale**: La constraint a nivel de base de datos es la forma más confiable de prevenir duplicados, incluso bajo condiciones de carrera.

### 2. Queries Eficientes para Contadores

**Problema**: Cargar todas las relaciones para contar items es ineficiente y no escala.

**Solución**: Usar queries SQL `COUNT()`:
```typescript
const likesCount = await this.likesRepository.count({ where: { postId } });
```

**Rationale**: 
- COUNT() está optimizado en PostgreSQL
- No carga datos innecesarios
- Escala bien con millones de registros

### 3. Notificaciones Asíncronas con EventEmitter

**Problema**: Necesitamos enviar notificaciones sin bloquear las respuestas HTTP.

**Solución**: Patrón NestJS EventEmitter:
```typescript
// Emitir evento después de crear like
this.eventEmitter.emit('like.created', { postId, userId });

// Manejar asíncronamente en listener
@OnEvent('like.created')
async handleLikeCreated(payload) { /* ... */ }
```

**Rationale**:
- Simple, sin dependencias externas
- Suficiente para esta escala
- Fácil de reemplazar con cola Bull/Redis más adelante si es necesario

## 🔧 Scripts Disponibles

### Scripts Principales (Recomendados)

```bash
./run.sh              # ⭐ Setup completo y ejecutar todos los tests
./setup.sh            # Setup inicial (crea .env, inicia Docker)
./test-all.sh         # Ejecutar todos los tests y verificar API
```

### Scripts NPM

```bash
# Desarrollo
npm run start:dev      # Iniciar con hot-reload
npm run start:debug    # Iniciar con debugger

# Producción
npm run build          # Compilar la aplicación
npm run start:prod     # Iniciar servidor de producción

# Testing
npm test               # Ejecutar tests unitarios
npm run test:watch     # Ejecutar tests en modo watch
npm run test:cov       # Ejecutar tests con cobertura
npm run test:e2e       # Ejecutar tests E2E
npm run test:all       # Ejecutar todos los tests (usa test-all.sh)
npm run setup          # Setup inicial (usa setup.sh)

# Base de Datos
npm run typeorm        # CLI de TypeORM
npm run migration:generate  # Generar migración
npm run migration:run       # Ejecutar migraciones
npm run migration:revert    # Revertir migración
npm run seed           # Poblar base de datos con datos de prueba
```

## 🐳 Comandos Docker

```bash
# Iniciar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f app

# Detener todos los servicios
docker compose down

# Reconstruir e iniciar
docker-compose up -d --build

# Acceder a PostgreSQL
docker-compose exec postgres psql -U debook_user -d debook_db

# Ejecutar comandos en el contenedor de la app
docker-compose exec app npm test
docker-compose exec app npm run seed
```

## 🚦 Probar la Aplicación Manualmente

El script `test-all.sh` ya prueba todos los endpoints automáticamente, pero si quieres probar manualmente:

1. **Crear un post de prueba**:
   ```bash
   docker-compose exec postgres psql -U debook_user -d debook_db -c \
     "INSERT INTO posts (content, \"authorId\") VALUES ('Post de prueba', '550e8400-e29b-41d4-a716-446655440000') RETURNING id;"
   ```

2. **Crear un like** (usa un UUID válido para x-user-id):
   ```bash
   curl -X POST http://localhost:3000/v1/posts/{POST_ID}/like \
     -H "x-user-id: 770e8400-e29b-41d4-a716-446655440000"
   ```

3. **Obtener post con contadores**:
   ```bash
   curl http://localhost:3000/v1/posts/{POST_ID}
   ```

4. **Probar like duplicado** (debe ser idempotente):
   ```bash
   curl -X POST http://localhost:3000/v1/posts/{POST_ID}/like \
     -H "x-user-id: 770e8400-e29b-41d4-a716-446655440000"
   ```

> **Nota**: El puerto puede ser 3000 o 3001 dependiendo de tu configuración. Verifica con `docker-compose ps`.

## 📝 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | Host de PostgreSQL | `postgres` |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` |
| `DATABASE_USER` | Usuario de la base de datos | `debook_user` |
| `DATABASE_PASSWORD` | Contraseña de la base de datos | `debook_password` |
| `DATABASE_NAME` | Nombre de la base de datos | `debook_db` |
| `NODE_ENV` | Entorno | `development` |
| `PORT` | Puerto de la aplicación | `3000` |
| `TYPEORM_SYNCHRONIZE` | Auto-sincronizar schema | `true` (solo dev) |
| `TYPEORM_LOGGING` | Habilitar logging SQL | `false` |

## ✅ Estado de la Implementación

- ✅ Todos los endpoints funcionando
- ✅ Base de datos en Docker
- ✅ Aplicación en Docker
- ✅ Tests pasando (8 tests unitarios, 6 tests E2E)
- ✅ Queries eficientes (usa COUNT, no carga relaciones)
- ✅ Creación de likes idempotente
- ✅ Notificaciones asíncronas funcionando
- ✅ Código limpio y mantenible
- ✅ README completo
- ✅ **Setup completamente automatizado** - Un solo comando para todo
- ✅ Scripts de automatización (`setup.sh`, `test-all.sh`, `run.sh`)

---

**Construido con ❤️ para Debook**
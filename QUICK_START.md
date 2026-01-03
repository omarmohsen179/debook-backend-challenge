# 🚀 Quick Start - Un Solo Comando

Para desarrolladores nuevos: **todo funciona con un solo comando**.

## ⚡ Inicio Rápido

```bash
cd backend
./run.sh
```

**¡Eso es todo!** Este comando:
- ✅ Configura todo automáticamente
- ✅ Inicia Docker y los servicios
- ✅ Ejecuta todos los tests
- ✅ Verifica que todo funciona

## 📋 Requisitos Previos

Solo necesitas:
- **Docker Desktop** instalado y corriendo

> **¡Eso es todo!** No necesitas Node.js, npm, PostgreSQL ni ninguna otra dependencia. Todo corre dentro de Docker.

## 🎯 Qué Hace el Script

1. **Verifica Docker**: Comprueba que Docker esté corriendo
2. **Crea .env**: Copia `.env.example` a `.env` si no existe
3. **Construye Imágenes**: Construye las imágenes Docker necesarias (app y test)
4. **Inicia Servicios**: Inicia PostgreSQL y la aplicación NestJS
5. **Espera Listo**: Espera a que los servicios estén saludables
6. **Ejecuta Tests**: Corre todos los tests **dentro de Docker** (unitarios, E2E, API)
7. **Verifica**: Confirma que todo funciona correctamente

**Todo corre en contenedores Docker - No necesitas Node.js localmente**

## 📊 Resultado Esperado

Al finalizar, verás:
- ✅ 8 tests unitarios pasando
- ✅ 6 tests E2E pasando
- ✅ Pruebas de API exitosas
- ✅ Aplicación corriendo en http://localhost:3000/v1

## 🔧 Comandos Útiles

```bash
# Solo setup (sin tests)
./setup.sh

# Solo tests (después de setup)
./test-all.sh

# Ver logs
docker compose logs -f app

# Ver estado
docker compose ps

# Detener todo
docker compose down
```

## ❓ Problemas Comunes

### Docker no está corriendo
```bash
# Inicia Docker Desktop y vuelve a ejecutar
./run.sh
```

### Puerto ocupado
```bash
# El script usa puerto 3000 o 3001 automáticamente
# Si hay conflicto, edita docker-compose.yml
```

### Tests fallan
```bash
# Asegúrate de que PostgreSQL esté corriendo
docker compose ps postgres

# Revisa logs
docker compose logs app

# Reconstruir contenedores
docker compose build --no-cache
```

---

**Para más detalles, consulta el [README.md](./README.md)**

# Directivas para Claude Code (`CLAUDE.md`)

Lee y respeta todas las reglas definidas en `AGENTS.md`.

## Resumen de Arquitectura
- **`src/app.js`**: Servidor Express (ESM), montaje de middlewares globales y limitadores de tasa (`express-rate-limit`).
- **`src/middlewares/rateLimiter.js`**: Configuración modular de limitadores (`globalLimiter`, `apiLimiter`, `strictCreateLimiter`) con respuestas JSON personalizadas, código HTTP `429 Too Many Requests` y cabeceras estándar/legacy.
- **`src/data/videojuegos.db.js`**: Persistencia en memoria mediante arreglo mutable de videojuegos (`videojuegos`).
- **`src/routes/videojuegos.routes.js`**: Enrutador modular `express.Router()` con CRUD completo de videojuegos (`/api/videojuegos`).
- **`index.html`**: Landing interactiva con modo diapositivas/documento, visor VS Code Dark+ línea por línea con wrap automático, diagrama vectorial de tokens y simulador Sandbox en vivo con bloqueo `429`.

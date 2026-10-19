/**
 * Helper de Rate Limit (Sección 3 de la Guía: Configuración como Middleware)
 * --------------------------------------------------------------------------
 * Re-exporta los limitadores de tasa configurados en src/middlewares/rateLimiter.js
 * para mantener compatibilidad directa con el patrón helperLimit.js.
 */

export { apiLimiter, crearJuegoLimiter } from "./middlewares/rateLimiter.js";

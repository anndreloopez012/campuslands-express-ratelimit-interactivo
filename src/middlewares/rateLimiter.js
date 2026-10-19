/**
 * Configuración del Middleware express-rate-limit (helperLimit / rateLimiter)
 * ---------------------------------------------------------------------------
 * Este módulo centraliza los limitadores de tasa de solicitudes (Rate Limiters)
 * para proteger nuestra API REST de Videojuegos contra ataques de Denegación
 * de Servicio (DoS), fuerza bruta y abuso de peticiones por dirección IP.
 *
 * Opciones clave utilizadas:
 * - windowMs: Ventana de tiempo en milisegundos (60 * 1000 = 1 minuto).
 * - limit (o max): Número máximo de solicitudes permitidas por IP en la ventana.
 * - statusCode: Código de estado HTTP al bloquear (429 Too Many Requests).
 * - message: Respuesta personalizada en formato JSON cuando se agotan los tokens.
 * - standardHeaders: 'draft-7' habilita el encabezado estándar RateLimit.
 * - legacyHeaders: true habilita los encabezados clásicos X-RateLimit-*.
 */

import { rateLimit } from "express-rate-limit";

/**
 * 1. Limitador General para la API (/api/)
 * Permite un máximo de 5 solicitudes por minuto por dirección IP.
 * Al hacer la solicitud #6 dentro del mismo minuto, devuelve HTTP 429.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto (60 segundos * 1000 milisegundos)
  limit: 5, // Máximo 5 solicitudes (tokens) por ventana de 1 minuto
  statusCode: 429, // Código HTTP 429: Too Many Requests
  standardHeaders: "draft-7", // Agrega cabecera estándar RateLimit (IETF draft-7)
  legacyHeaders: true, // Agrega X-RateLimit-Limit, X-RateLimit-Remaining y X-RateLimit-Reset
  message: {
    exito: false,
    status: 429,
    error: "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo en un minuto.",
    detalle: "Has agotado tus 5 tokens disponibles en la ventana actual de 60 segundos."
  }
});

/**
 * 2. Limitador Estricto para Creación de Videojuegos (POST /api/videojuegos)
 * Protege específicamente la ruta de escritura permitiendo máximo 3 registros por minuto.
 */
export const crearJuegoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 3, // Máximo 3 creaciones por minuto por IP
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: true,
  message: {
    exito: false,
    status: 429,
    error: "Límite de creación alcanzado: Solo puedes registrar 3 videojuegos por minuto.",
    detalle: "Espera a que se reinicie la ventana de tiempo antes de enviar otro POST."
  }
});

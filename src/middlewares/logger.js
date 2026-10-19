/**
 * Middleware de Registro y Auditoría de Tráfico (Logger)
 * ------------------------------------------------------
 * Imprime en la consola del servidor cada petición HTTP entrante junto con
 * su estampa de tiempo ISO, método HTTP y ruta solicitada.
 */

export function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const metodo = req.method;
  const url = req.originalUrl || req.url;

  console.log(`[${timestamp}] 🎮 ${metodo} -> ${url}`);

  // Obligatorio invocar next() para continuar hacia el siguiente middleware
  next();
}

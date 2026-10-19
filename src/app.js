/**
 * Servidor Principal Express con Middleware express-rate-limit (ESM)
 * ------------------------------------------------------------------
 * Aplicación educativa de Campuslands que protege una API REST de Videojuegos
 * almacenados en un arreglo en memoria utilizando express-rate-limit como middleware.
 */

import express from "express";
import { logger } from "./middlewares/logger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import videojuegosRouter from "./routes/videojuegos.routes.js";

// 1. Instanciar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares Globales de Parseo y Auditoría
app.use(express.json());
app.use(logger);

// 3. Ruta Pública de Bienvenida (sin límite estricto de API)
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "🎮 Bienvenido a la API de Videojuegos protegida con express-rate-limit (Campuslands)",
    seguridad: "Middleware express-rate-limit activo en /api/ (Máx. 5 peticiones por minuto por IP)",
    almacenamiento: "Arreglo de videojuegos en memoria RAM (sin base de datos externa)",
    endpoints: {
      listar_juegos: "GET /api/videojuegos",
      buscar_por_id: "GET /api/videojuegos/:id",
      crear_juego: "POST /api/videojuegos",
      actualizar_juego: "PUT /api/videojuegos/:id",
      eliminar_juego: "DELETE /api/videojuegos/:id"
    }
  });
});

// 4. Aplicar el middleware de Rate Limit a todas las rutas que comiencen con '/api/'
app.use("/api/", apiLimiter);

// 5. Montar el Enrutador Modular de Videojuegos
app.use("/api/videojuegos", videojuegosRouter);

// 6. Middleware para Rutas Inexistentes (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    error: `La ruta '${req.method} ${req.originalUrl}' no existe en el servidor de videojuegos.`
  });
});

// 7. Middleware Global de Manejo de Errores (4 parámetros)
app.use(errorHandler);

// 8. Iniciar el servidor HTTP si no estamos en modo test
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🎮 Servidor de Videojuegos iniciado en http://localhost:${PORT}`);
    console.log(`🛡️  Rate Limit activo en /api/videojuegos (Máx: 5 req / min)`);
    console.log(`=============================================================\n`);
  });
}

export default app;

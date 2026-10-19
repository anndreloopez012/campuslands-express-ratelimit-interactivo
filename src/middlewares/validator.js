/**
 * Middleware de Validación de Videojuegos
 * ---------------------------------------
 * Verifica que el cuerpo de la petición (req.body) en POST y PUT contenga
 * los campos obligatorios: titulo, genero, plataforma y precio.
 */

export function validarVideojuego(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      exito: false,
      error: "Se requiere enviar un cuerpo JSON válido en la solicitud."
    });
  }

  const { titulo, genero, plataforma, precio } = req.body;

  if (!titulo || typeof titulo !== "string" || titulo.trim().length === 0) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'titulo' del videojuego es obligatorio."
    });
  }

  if (!genero || typeof genero !== "string" || genero.trim().length === 0) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'genero' es obligatorio (ej: RPG, Acción, Aventura)."
    });
  }

  if (!plataforma || typeof plataforma !== "string" || plataforma.trim().length === 0) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'plataforma' es obligatorio (ej: PC, Switch, PS5)."
    });
  }

  const precioNum = Number(precio);
  if (precio === undefined || precio === null || isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'precio' debe ser un número válido mayor o igual a 0."
    });
  }

  // Si todos los datos son válidos, continuamos al controlador
  next();
}

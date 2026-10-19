/**
 * Base de Datos en Memoria: Catálogo de Videojuegos (Arreglo JavaScript Nativo)
 * -----------------------------------------------------------------------------
 * En este ejercicio pedagógico no utilizamos un motor de base de datos externo.
 * Los videojuegos se almacenan en un arreglo mutable en memoria RAM exportado
 * mediante ECMAScript Modules (ESM).
 *
 * Estructura de cada Videojuego:
 * - id: Identificador numérico único
 * - titulo: Nombre oficial del videojuego
 * - genero: Categoría del juego (RPG, Acción, Metroidvania, Aventura, etc.)
 * - plataforma: Consola o sistema principal (PC, PlayStation 5, Nintendo Switch, Multiplataforma)
 * - precio: Precio en USD (número)
 */

export let videojuegos = [
  {
    id: 1,
    titulo: "The Legend of Zelda: Tears of the Kingdom",
    genero: "Aventura / RPG",
    plataforma: "Nintendo Switch",
    precio: 69.99
  },
  {
    id: 2,
    titulo: "Elden Ring: Shadow of the Erdtree",
    genero: "Action RPG",
    plataforma: "Multiplataforma",
    precio: 59.99
  },
  {
    id: 3,
    titulo: "Hollow Knight: Silksong",
    genero: "Metroidvania",
    plataforma: "PC / Consolas",
    precio: 29.99
  },
  {
    id: 4,
    titulo: "Cyberpunk 2077: Phantom Liberty",
    genero: "RPG / Ciencia Ficción",
    plataforma: "PC / PS5 / Xbox Series X",
    precio: 49.99
  }
];

/**
 * Restaura el catálogo de videojuegos a los 4 registros semilla originales.
 * Útil para pruebas automatizadas y reinicio de laboratorio.
 */
export function reiniciarVideojuegos() {
  videojuegos.length = 0;
  videojuegos.push(
    {
      id: 1,
      titulo: "The Legend of Zelda: Tears of the Kingdom",
      genero: "Aventura / RPG",
      plataforma: "Nintendo Switch",
      precio: 69.99
    },
    {
      id: 2,
      titulo: "Elden Ring: Shadow of the Erdtree",
      genero: "Action RPG",
      plataforma: "Multiplataforma",
      precio: 59.99
    },
    {
      id: 3,
      titulo: "Hollow Knight: Silksong",
      genero: "Metroidvania",
      plataforma: "PC / Consolas",
      precio: 29.99
    },
    {
      id: 4,
      titulo: "Cyberpunk 2077: Phantom Liberty",
      genero: "RPG / Ciencia Ficción",
      plataforma: "PC / PS5 / Xbox Series X",
      precio: 49.99
    }
  );
  return videojuegos;
}

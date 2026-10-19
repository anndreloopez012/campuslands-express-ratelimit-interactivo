/**
 * Suite de Pruebas Automatizadas End-to-End: CRUD Videojuegos + express-rate-limit
 * --------------------------------------------------------------------------------
 * Verifica con fetch nativo:
 * 1. GET / (Bienvenida 200 OK)
 * 2. GET /api/videojuegos (Listado inicial de 4 videojuegos + cabeceras X-RateLimit-*)
 * 3. GET /api/videojuegos/1 (Búsqueda por ID existente -> 200 OK)
 * 4. POST /api/videojuegos (Creación de nuevo videojuego -> 201 Created)
 * 5. PUT /api/videojuegos/2 (Actualización de videojuego -> 200 OK)
 * 6. DELETE /api/videojuegos/3 (Eliminación de videojuego -> 200 OK)
 * 7. SEXTA petición a /api/videojuegos en el mismo minuto -> Bloqueo 429 Too Many Requests
 */

import assert from "node:assert/strict";
import app from "../src/app.js";

process.env.NODE_ENV = "test";
const PORT = 3299;
const BASE_URL = `http://localhost:${PORT}`;

let server;

async function runTests() {
  console.log("🧪 [INICIANDO SUITE DE PRUEBAS: API VIDEOJUEGOS + EXPRESS-RATE-LIMIT]...\n");

  server = app.listen(PORT);

  try {
    // 1. Ruta raíz pública (no consume tokens de /api/)
    console.log("1. Probando GET / (Bienvenida pública)...");
    const resHome = await fetch(`${BASE_URL}/`);
    assert.equal(resHome.status, 200, "GET / debe responder 200 OK");
    const jsonHome = await resHome.json();
    assert.ok(jsonHome.mensaje.includes("Videojuegos"), "Debe incluir mensaje de Videojuegos");
    console.log("   ✅ PASÓ: GET / respondió 200 OK sin consumir tokens de /api/");

    // 2. Petición #1 a /api/videojuegos (Quedan 4 tokens)
    console.log("2. [Token 1/5] Probando GET /api/videojuegos y cabeceras RateLimit...");
    const resList = await fetch(`${BASE_URL}/api/videojuegos`);
    assert.equal(resList.status, 200, "Petición #1 debe responder 200 OK");
    assert.equal(resList.headers.get("x-ratelimit-limit"), "5", "X-RateLimit-Limit debe ser 5");
    assert.equal(resList.headers.get("x-ratelimit-remaining"), "4", "X-RateLimit-Remaining debe ser 4");
    const jsonList = await resList.json();
    assert.equal(jsonList.total, 4, "Debe iniciar con 4 videojuegos en el arreglo");
    console.log("   ✅ PASÓ: Catálogo inicial de 4 videojuegos y X-RateLimit-Remaining: 4");

    // 3. Petición #2 a /api/videojuegos/1 (Quedan 3 tokens)
    console.log("3. [Token 2/5] Probando GET /api/videojuegos/1...");
    const resOne = await fetch(`${BASE_URL}/api/videojuegos/1`);
    assert.equal(resOne.status, 200, "Petición #2 debe responder 200 OK");
    assert.equal(resOne.headers.get("x-ratelimit-remaining"), "3", "X-RateLimit-Remaining debe ser 3");
    const jsonOne = await resOne.json();
    assert.ok(jsonOne.videojuego.titulo.includes("Zelda"), "Debe encontrar The Legend of Zelda");
    console.log("   ✅ PASÓ: Encontró Zelda Tears of the Kingdom (Tokens restantes: 3)");

    // 4. Petición #3 a POST /api/videojuegos (Quedan 2 tokens)
    console.log("4. [Token 3/5] Probando POST /api/videojuegos (Registrar nuevo juego)...");
    const nuevoJuego = {
      titulo: "God of War Ragnarök",
      genero: "Acción / Aventura",
      plataforma: "PlayStation 5 / PC",
      precio: 59.99
    };
    const resPost = await fetch(`${BASE_URL}/api/videojuegos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoJuego)
    });
    assert.equal(resPost.status, 201, "POST debe responder 201 Created");
    assert.equal(resPost.headers.get("x-ratelimit-remaining"), "2", "X-RateLimit-Remaining debe ser 2");
    const jsonPost = await resPost.json();
    assert.equal(jsonPost.videojuego.id, 5, "El nuevo videojuego debe tener ID 5");
    console.log("   ✅ PASÓ: Creado 'God of War Ragnarök' con ID 5 (Tokens restantes: 2)");

    // 5. Petición #4 a PUT /api/videojuegos/2 (Queda 1 token)
    console.log("5. [Token 4/5] Probando PUT /api/videojuegos/2 (Actualizar precio)...");
    const resPut = await fetch(`${BASE_URL}/api/videojuegos/2`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: "Elden Ring: Shadow of the Erdtree GOTY",
        genero: "Action RPG",
        plataforma: "Multiplataforma",
        precio: 49.99
      })
    });
    assert.equal(resPut.status, 200, "PUT debe responder 200 OK");
    assert.equal(resPut.headers.get("x-ratelimit-remaining"), "1", "X-RateLimit-Remaining debe ser 1");
    console.log("   ✅ PASÓ: Videojuego ID 2 actualizado (Tokens restantes: 1)");

    // 6. Petición #5 a DELETE /api/videojuegos/3 (Quedan 0 tokens)
    console.log("6. [Token 5/5] Probando DELETE /api/videojuegos/3 (Eliminar juego)...");
    const resDel = await fetch(`${BASE_URL}/api/videojuegos/3`, {
      method: "DELETE"
    });
    assert.equal(resDel.status, 200, "DELETE debe responder 200 OK");
    assert.equal(resDel.headers.get("x-ratelimit-remaining"), "0", "X-RateLimit-Remaining debe llegar a 0");
    console.log("   ✅ PASÓ: Videojuego ID 3 eliminado (Tokens restantes: 0)");

    // 7. Petición #6 a GET /api/videojuegos -> DEBE SER BLOQUEADA CON 429 TOO MANY REQUESTS
    console.log("7. [Petición #6 Excedida] Verificando bloqueo 429 Too Many Requests de express-rate-limit...");
    const resBlocked = await fetch(`${BASE_URL}/api/videojuegos`);
    assert.equal(resBlocked.status, 429, "La 6ta solicitud debe retornar 429 Too Many Requests");
    const jsonBlocked = await resBlocked.json();
    assert.equal(jsonBlocked.exito, false);
    assert.ok(
      jsonBlocked.error.includes("Demasiadas solicitudes desde esta IP"),
      "Debe retornar el mensaje personalizado de bloqueo"
    );
    console.log("   ✅ PASÓ: Middleware express-rate-limit bloqueó la 6ta solicitud con HTTP 429!");

    console.log("\n🎉 ¡TODAS LAS PRUEBAS (7/7) DE CRUD Y RATE LIMIT PASARON CON ÉXITO!\n");
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();

// ====== REFERENCIAS ======
const escena     = document.getElementById("escena");
const estrellas  = document.getElementById("estrellas");
const cuerda     = document.getElementById("cuerda");
const contenedor = document.getElementById("cuerdaContenedor");
const ayuda      = document.getElementById("ayuda");

// ====== 1. GENERAR ESTRELLAS ======
function crearEstrellas(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const estrella = document.createElement("div");
    estrella.classList.add("estrella");

    const tam = Math.random() * 3 + 1;
    estrella.style.width  = tam + "px";
    estrella.style.height = tam + "px";
    estrella.style.left   = Math.random() * 100 + "%";
    estrella.style.top    = Math.random() * 70 + "%";
    estrella.style.animationDelay    = Math.random() * 3 + "s";
    estrella.style.animationDuration = (Math.random() * 2 + 1.5) + "s";

    estrellas.appendChild(estrella);
  }
}
crearEstrellas(120);

// ====== 2. CONFIGURACIÓN ======
const ALTURA_BASE   = 70;
const JALON_MAXIMO  = 130;
const UMBRAL_DIA    = 95;

// ⏱️ Valores DEBEN coincidir con el CSS (en milisegundos)
const DURACION_TRANSICION  = 4000; // --velocidad
const DURACION_ATARDECER   = 4000; // --velocidad-atardecer

let arrastrando  = false;
let inicioY      = 0;
let alturaActual = ALTURA_BASE;
let estado       = "noche"; // "noche" | "dia" | "atardecer"
let bloqueado    = false;

// ====== 3. ARRASTRE ======
function iniciarArrastre(e) {
  if (bloqueado) return;
  arrastrando = true;
  inicioY = e.touches ? e.touches[0].clientY : e.clientY;
  e.preventDefault();
}

function moverArrastre(e) {
  if (!arrastrando) return;
  const yActual = e.touches ? e.touches[0].clientY : e.clientY;
  const desplazamiento = yActual - inicioY;

  alturaActual = ALTURA_BASE + Math.max(0, Math.min(desplazamiento, JALON_MAXIMO - ALTURA_BASE));
  cuerda.style.transition = "none";
  cuerda.style.height = alturaActual + "px";
}

function soltarArrastre() {
  if (!arrastrando) return;
  arrastrando = false;
  cuerda.style.transition = "";

  if (alturaActual >= UMBRAL_DIA && !bloqueado) {
    cambiarEstado();
  }

  alturaActual = ALTURA_BASE;
  cuerda.style.height = alturaActual + "px";
  inicioY = 0;
}

// ====== 4. LÓGICA DE ESTADOS ======
function aplicarClases() {
  escena.classList.remove("dia", "atardecer");
  if (estado === "dia")        escena.classList.add("dia");
  if (estado === "atardecer")  escena.classList.add("atardecer");
}

function cambiarEstado() {
  bloqueado = true;

  if (estado === "noche") {
    // 🌙 → ☀️ amanecer normal
    estado = "dia";
    aplicarClases();
    ayuda.textContent = "☀️ ¡Es de día! Jala de nuevo para traer la noche";

    setTimeout(() => {
      bloqueado = false;
    }, DURACION_TRANSICION + 200);

  } else if (estado === "dia") {
    // ☀️ → 🌇 primero atardecer...
    estado = "atardecer";
    aplicarClases();
    ayuda.textContent = "🌇 El sol se está poniendo...";

    setTimeout(() => {
      // ...y luego noche
      estado = "noche";
      aplicarClases();
      ayuda.textContent = "🌙 Arrastra la cuerda hacia abajo 👇";
      bloqueado = false;
    }, DURACION_ATARDECER + 300);

  } else if (estado === "atardecer") {
    // Por si acaso
    estado = "noche";
    aplicarClases();
    setTimeout(() => { bloqueado = false; }, DURACION_TRANSICION + 200);
  }
}

// Eventos ratón
contenedor.addEventListener("mousedown", iniciarArrastre);
window.addEventListener("mousemove", moverArrastre);
window.addEventListener("mouseup", soltarArrastre);

// Eventos táctiles
contenedor.addEventListener("touchstart", iniciarArrastre, { passive: false });
window.addEventListener("touchmove", moverArrastre, { passive: false });
window.addEventListener("touchend", soltarArrastre);

// ====== 5. ESTRELLAS FUGACES 🌠 ======
function lanzarFugaz() {
  // Solo de noche
  if (estado !== "noche") return;

  const fugaz = document.createElement("div");
  fugaz.classList.add("fugaz");

  // Aparecen en la zona superior del cielo
  fugaz.style.top  = (Math.random() * 40 + 5) + "%";
  fugaz.style.left = (Math.random() * 50) + "%";

  // Duración aleatoria entre 1.2s y 2s
  const duracion = (Math.random() * 0.8 + 1.2).toFixed(2);
  fugaz.style.animation = `fugaz ${duracion}s linear forwards`;

  document.querySelector(".escena").appendChild(fugaz);

  // Limpieza
  setTimeout(() => fugaz.remove(), duracion * 1000 + 100);
}

// Bucle: cada 2.5 – 6 segundos lanza una fugaz (si es de noche)
function programarFugaces() {
  const espera = Math.random() * 3500 + 2500;
  setTimeout(() => {
    lanzarFugaz();
    programarFugaces();
  }, espera);
}
programarFugaces();
// Botón, body, header y formulario, seleccionados con querySelector
const btnTheme = document.querySelector('#btn-theme');
const body = document.querySelector('body');
const header = document.querySelector('header');
const formulario = document.querySelector('#contacto');

// ---------- TEMA GUARDADO ----------
// Al cargar la página se mira si hay un tema guardado en localStorage
let temaGuardado = null;
try {
  temaGuardado = localStorage.getItem('tema');   // 'dark', 'light' o null
} catch (error) {
  // Si el navegador bloquea el almacenamiento, se usa el tema claro
}

if (temaGuardado === 'dark') {
  body.classList.add('dark');          // modo oscuro aplicado antes de que el usuario haga nada
  btnTheme.textContent = 'Modo día';   // el botón muestra la acción que hará
} else {
  btnTheme.textContent = 'Modo noche';
}

// ¿El usuario prefiere menos movimiento?
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- BANDA DE TEXTO QUE SE DESPLAZA ----------
const ticker = document.createElement('div');
ticker.id = 'ticker';
ticker.setAttribute('aria-hidden', 'true');   // decorativo: los lectores de pantalla lo ignoran

const tickerTexto = document.createElement('span');
tickerTexto.textContent =
  '★ ONLINE NOW! ★ Humor: hiperactivo ★ Escuchando: tu canción favorita de 2005 ★ ' +
  'Estado: ¡pide presupuesto sin compromiso! ★ No olvides dejar tu comentario ★';

ticker.appendChild(tickerTexto);
header.insertAdjacentElement('afterend', ticker);   // justo debajo del header

// ---------- CONTADOR DE VISITAS ----------
// Cuenta las veces que se carga la página en este navegador
let visitas = 1000;
try {
  visitas = Number(localStorage.getItem('visitas')) || 1000;
  visitas++;
  localStorage.setItem('visitas', String(visitas));
} catch (error) {
  // Si el navegador bloquea el almacenamiento, se queda en 1001
  visitas = 1001;
}

const contador = document.createElement('div');
contador.id = 'contador';
contador.append('Visitas a mi perfil:');

const digitos = document.createElement('span');
digitos.className = 'digitos';

// Un cuadrito negro por cada dígito, hasta 6 cifras
String(visitas).padStart(6, '0').split('').forEach((numero) => {
  const caja = document.createElement('span');
  caja.className = 'digito';
  caja.textContent = numero;
  digitos.appendChild(caja);
});
contador.appendChild(digitos);

const nota = document.createElement('small');
nota.textContent = 'Mejor visto con Internet Explorer 6 en 800x600 ★ Gracias por pasarte ★';
contador.appendChild(nota);

body.appendChild(contador);

// ---------- RASTRO DE ESTRELLAS DEL CURSOR ----------
const simbolos = ['★', '✦', '✧', '♥'];
const coloresChispa = ['#ff1493', '#ffd800', '#00ccff', '#33dd33', '#9933ff', '#ff6600'];
let ultimaChispa = 0;

if (!reducirMovimiento) {
  document.addEventListener('mousemove', (evento) => {
    const ahora = Date.now();
    if (ahora - ultimaChispa < 45) return;   // máximo una cada 45 ms, para no sobrecargar
    ultimaChispa = ahora;

    const chispa = document.createElement('span');
    chispa.className = 'chispa';
    chispa.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    chispa.style.left = evento.clientX + 'px';
    chispa.style.top = evento.clientY + 'px';
    chispa.style.color = coloresChispa[Math.floor(Math.random() * coloresChispa.length)];
    chispa.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');   // se desvía a un lado

    body.appendChild(chispa);

    // Se elimina al terminar la animación para no acumular elementos
    chispa.addEventListener('animationend', () => chispa.remove());
  });
}

// ---------- CAMBIO DE TEMA ----------
btnTheme.addEventListener('click', () => {
  // toggle devuelve true si ahora el body tiene la clase "dark"
  const esOscuro = body.classList.toggle('dark');

  // El botón muestra la acción que hará la próxima vez
  btnTheme.textContent = esOscuro ? 'Modo día' : 'Modo noche';

  // Se guarda la elección para la próxima vez que se abra la página
  try {
    localStorage.setItem('tema', esOscuro ? 'dark' : 'light');
  } catch (error) {
    // Si el almacenamiento está bloqueado, el tema solo dura esta visita
  }

  console.log('Tema oscuro (Noche) activado:', esOscuro);
});

// ---------- VALIDACIÓN DEL FORMULARIO ----------
// Marca un campo con borde rojo y crea un mensaje de error debajo
function mostrarError(campo, mensaje) {
  campo.classList.add('error');

  const aviso = document.createElement('small');
  aviso.className = 'mensaje-error';
  aviso.textContent = mensaje;
  campo.insertAdjacentElement('afterend', aviso);
}

// Quita los errores del intento anterior
function limpiarErrores() {
  formulario.querySelectorAll('.error').forEach((campo) => campo.classList.remove('error'));
  formulario.querySelectorAll('.mensaje-error').forEach((aviso) => aviso.remove());
}

formulario.addEventListener('submit', (event) => {
  // Detiene la recarga por defecto de la página
  event.preventDefault();
  limpiarErrores();

  // Captura de los campos (los de texto, con trim() para quitar espacios sobrantes)
  const campoNombre = document.querySelector('#nombre');
  const campoEmail = document.querySelector('#email');
  const campoServicio = document.querySelector('#servicio');
  const campoMensaje = document.querySelector('#mensaje');

  const nombre = campoNombre.value.trim();
  const email = campoEmail.value.trim();
  const servicio = campoServicio.value;
  const mensaje = campoMensaje.value.trim();

  let todoCorrecto = true;

  if (nombre === '') {
    mostrarError(campoNombre, 'Escribe tu nombre.');
    todoCorrecto = false;
  }

  // Correo: vacío, o sin @, o sin punto -> se muestra un aviso
  if (email === '') {
    mostrarError(campoEmail, 'Escribe tu correo electrónico.');
    todoCorrecto = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    mostrarError(campoEmail, 'El correo debe contener @ y un punto (ejemplo: juan@gmail.com).');
    todoCorrecto = false;
  }

  if (servicio === '') {
    mostrarError(campoServicio, 'Elige un servicio.');
    todoCorrecto = false;
  }

  if (mensaje === '') {
    mostrarError(campoMensaje, 'Escribe un mensaje.');
    todoCorrecto = false;
  }

  // Si falta algo o es incorrecto, se detiene aquí
  if (!todoCorrecto) {
    console.log('Formulario incompleto o con errores: no se envía');
    return;
  }

  // Todo correcto: mensaje de control con los datos capturados
  console.log('Envío detenido: la página no se ha recargado');
  console.log('Datos validados:', { nombre, email, servicio, mensaje });

  formulario.reset();   // vacía el formulario tras un envío correcto
});
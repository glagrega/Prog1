import { readSheet } from 'read-excel-file/universal';
import { questionsFromRows, pickQuestion } from './questions.js';
import './style.css';

const storageKey = 'prog1-question-bank-v1';
let questions = [];
let filename = '';
let loading = false;
let storageWarning = '';
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && Array.isArray(saved.questions) && saved.questions.every(q => typeof q === 'string' && q.trim())) {
    questions = saved.questions;
    filename = typeof saved.filename === 'string' ? saved.filename : 'Banco guardado';
  }
} catch { storageWarning = 'El almacenamiento local no está disponible. Puedes cargar y sortear preguntas durante esta sesión.'; }

document.querySelector('#app').innerHTML = `
  <header class="header wrap"><a class="brand" href="./"><span class="brand-mark" aria-hidden="true">?</span> al azar<span class="brand-period">.</span></a><span class="header-note">UNA PREGUNTA. MUCHAS POSIBILIDADES.</span></header>
  <main class="wrap">
    <section class="intro"><p class="eyebrow">TU BANCO DE PREGUNTAS</p><h1>Deja que el azar<br>haga <em>la pregunta.</em></h1><p>Carga tus preguntas, haz una pausa y descubre cuál sigue.</p></section>
    <div class="workspace">
      <section class="upload-panel" aria-labelledby="upload-title"><span class="step">01 / PREPARA</span><h2 id="upload-title">Carga tu banco</h2><p>Un Excel con tus preguntas.<br>Nosotros nos encargamos del resto.</p>
        <label class="dropzone" id="dropzone" for="excel"><span class="upload-icon" aria-hidden="true">↑</span><strong>Seleccionar archivo</strong><span>o arrastra tu Excel aquí</span><small>.xlsx · máximo 10 MB</small><input id="excel" type="file" accept=".xlsx" aria-describedby="format-help" /></label>
        <p class="format-help" id="format-help">Usa una columna <strong>Pregunta</strong> o escribe las preguntas en la primera columna, una por fila. Se lee la primera hoja y se omiten vacíos y duplicados.</p>
        <div class="bank-info"><span class="dot" aria-hidden="true"></span><span id="bank-status"></span></div><p id="file-name" class="file-name"></p>
        <button id="clear-bank" class="clear-button" disabled>Borrar banco de preguntas</button>
        <p class="privacy">Tu archivo se procesa en este navegador. El banco queda guardado en este dispositivo; no se envía a un servidor.</p>
      </section>
      <section class="question-panel" aria-labelledby="question-title"><div class="question-heading"><span class="step">02 / DESCUBRE</span><span class="pill">SELECCIÓN ALEATORIA</span></div>
        <div class="question-content" aria-live="polite" aria-atomic="true"><span class="quote" aria-hidden="true">“</span><h2 id="question-title">La próxima pregunta<br>está por llegar.</h2><p id="question-hint">Carga un banco para comenzar.</p></div>
        <button id="draw" class="draw-button" disabled>Elegir una pregunta <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 18 18 6M6 6h12v12"/></svg></button><p class="random-note">Cada sorteo es independiente. Una pregunta puede repetirse.</p>
      </section>
    </div>
    <p id="message" class="message" role="status"></p>
  </main>
  <footer class="wrap footer"><span>Menos distracciones. Más curiosidad.</span><span>Hecho para preguntar.</span></footer>`;

const fileInput = document.querySelector('#excel');
const draw = document.querySelector('#draw');
const clearBank = document.querySelector('#clear-bank');
const message = document.querySelector('#message');
const title = document.querySelector('#question-title');
const hint = document.querySelector('#question-hint');
function updateBank() {
  draw.disabled = loading || !questions.length;
  clearBank.disabled = loading || !questions.length;
  fileInput.disabled = loading;
  document.querySelector('#bank-status').textContent = loading ? 'Leyendo archivo…' : questions.length ? `${questions.length} pregunta${questions.length === 1 ? '' : 's'} disponible${questions.length === 1 ? '' : 's'}` : 'Aún no hay preguntas';
  document.querySelector('#file-name').textContent = filename;
  document.querySelector('.bank-info').classList.toggle('has-bank', !!questions.length);
}
clearBank.addEventListener('click', () => {
  if (loading || !questions.length) return;
  let removed = true;
  try { localStorage.removeItem(storageKey); } catch { removed = false; }
  questions = [];
  filename = '';
  fileInput.value = '';
  title.textContent = 'La próxima pregunta está por llegar.';
  hint.textContent = 'Carga un banco para comenzar.';
  draw.firstChild.textContent = 'Elegir una pregunta ';
  updateBank();
  message.textContent = removed
    ? 'Banco de preguntas borrado. Puedes cargar otro Excel.'
    : 'Banco borrado de esta sesión. No se pudo eliminar del almacenamiento del navegador; podría reaparecer al recargar.';
});
async function importFile(file) {
  if (!file || loading) return;
  message.textContent = '';
  if (!/\.xlsx$/i.test(file.name)) { message.textContent = 'Selecciona un archivo .xlsx. Si usas .xls, guárdalo como .xlsx desde Excel.'; return; }
  if (file.size > 10 * 1024 * 1024) { message.textContent = 'El archivo supera los 10 MB. Reduce su tamaño e inténtalo de nuevo.'; return; }
  loading = true;
  updateBank();
  try {
    const next = questionsFromRows(await readSheet(file));
    questions = next;
    filename = file.name;
    title.textContent = 'Tu próxima pregunta te espera.';
    hint.textContent = 'Pulsa el botón para descubrirla.';
    try {
      localStorage.setItem(storageKey, JSON.stringify({ questions, filename }));
      message.textContent = 'Banco cargado. Ya puedes sortear una pregunta.';
    } catch {
      // Evita restaurar un banco anterior cuando no se pudo guardar el nuevo.
      try { localStorage.removeItem(storageKey); } catch { /* almacenamiento no disponible */ }
      message.textContent = 'Banco cargado para esta sesión. No se pudo guardar en el navegador.';
    }
  } catch (error) {
    message.textContent = error.message?.startsWith('El Excel') || error.message?.startsWith('No encontramos') ? error.message : 'No se pudo leer el Excel. Comprueba que sea un .xlsx válido y sin contraseña.';
  } finally {
    loading = false;
    fileInput.value = '';
    updateBank();
  }
}
fileInput.addEventListener('change', () => importFile(fileInput.files[0]));
const dropzone = document.querySelector('#dropzone');
for (const name of ['dragenter', 'dragover']) dropzone.addEventListener(name, event => { event.preventDefault(); dropzone.classList.add('dragover'); });
for (const name of ['dragleave', 'drop']) dropzone.addEventListener(name, event => { event.preventDefault(); dropzone.classList.remove('dragover'); });
dropzone.addEventListener('drop', event => importFile(event.dataTransfer.files[0]));
draw.addEventListener('click', () => {
  const question = pickQuestion(questions);
  if (!question || loading) return;
  title.textContent = question;
  hint.textContent = 'Tómate tu tiempo. La respuesta es tuya.';
  draw.firstChild.textContent = 'Elegir otra pregunta ';
});
updateBank();
if (questions.length) hint.textContent = 'Tu banco está listo. Pulsa el botón para comenzar.';
message.textContent = storageWarning;

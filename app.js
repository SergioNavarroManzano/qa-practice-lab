'use strict';
// QA Practice Lab: front-end only, all credentials are illustrative.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const keys = { tasks: 'qa-practice-lab-tasks-v1', session: 'qa-practice-lab-session-v1' };
const demoTasks = [
  { id: 1, title: 'Revisar criterios de aceptación', done: true },
  { id: 2, title: 'Automatizar el flujo de login', done: false },
  { id: 3, title: 'Documentar defectos encontrados', done: false }
];
function navigate() {
  const route = location.hash.slice(1) || 'inicio';
  const valid = $$('[data-view]').some(view => view.dataset.view === route);
  const active = valid ? route : 'inicio';
  $$('[data-view]').forEach(view => { view.hidden = view.dataset.view !== active; });
  $$('[data-nav]').forEach(link => { const on = link.dataset.nav === active; link.classList.toggle('active', on); if (on) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
  document.title = `${active === 'inicio' ? 'Inicio' : active[0].toUpperCase() + active.slice(1)} | QA Practice Lab`;
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate); navigate();
function show(node, message) { node.textContent = message; node.hidden = false; }
function hide(node) { node.hidden = true; node.textContent = ''; }
// Simulated authentication, never use for real security.
function updateSession() {
  const loggedIn = sessionStorage.getItem(keys.session) === 'true';
  $('#login-guest').hidden = loggedIn;
  $('#login-user').hidden = !loggedIn;
}
$('#login-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#login-email').value.trim();
  const password = $('#login-password').value;
  const error = $('#login-error'); hide(error);
  if (!email || !password) return show(error, 'El correo y la contraseña son obligatorios.');
  if (email !== 'qa@test.com' || password !== 'Playwright123!') return show(error, 'Credenciales incorrectas. Inténtalo de nuevo.');
  sessionStorage.setItem(keys.session, 'true');
  $('#login-form').reset(); updateSession();
});
$('#logout').addEventListener('click', () => { sessionStorage.removeItem(keys.session); hide($('#login-error')); updateSession(); });
updateSession();
// Contact request form (no transmission or persistence).
$('#request-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#request-name').value.trim();
  const email = $('#request-email').value.trim();
  const type = $('#request-type').value;
  const message = $('#request-message').value.trim();
  const consent = $('#request-consent').checked;
  const error = $('#request-error'); const success = $('#request-success');
  hide(error); hide(success);
  if (name.length < 3 || name.length > 80) return show(error, 'El nombre debe contener entre 3 y 80 caracteres.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show(error, 'Introduce un correo electrónico válido.');
  if (!['soporte','consulta','incidencia'].includes(type)) return show(error, 'Selecciona un tipo de solicitud.');
  if (message.length < 10 || message.length > 500) return show(error, 'La descripción debe contener entre 10 y 500 caracteres.');
  if (!consent) return show(error, 'Debes aceptar el tratamiento simulado de los datos.');
  show(success, 'Solicitud registrada correctamente (simulación).');
});
$('#request-form').addEventListener('reset', () => { hide($('#request-error')); hide($('#request-success')); });
$('#locator-save').addEventListener('click', () => { const value = $('#locator-input').value.trim(); if (!value) { show($('#locator-output'), 'Introduce el nombre del proyecto.'); return; } show($('#locator-output'), `Proyecto guardado: ${value}`); });
$('#notifications').addEventListener('change', event => { $('#notification-status').textContent = event.target.checked ? 'Notificaciones activadas' : 'Notificaciones desactivadas'; });
$('#toggle-details').addEventListener('click', () => { const content = $('#detail-content'); content.hidden = !content.hidden; $('#toggle-details').setAttribute('aria-expanded', String(!content.hidden)); $('#toggle-details').textContent = content.hidden ? 'Mostrar detalles' : 'Ocultar detalles'; });
// Tasks use localStorage. All dynamic content is created with textContent, not HTML injection.
function getTasks() { try { const parsed = JSON.parse(localStorage.getItem(keys.tasks)); return Array.isArray(parsed) ? parsed : demoTasks.map(task => ({ ...task })); } catch { return demoTasks.map(task => ({ ...task })); } }
let tasks = getTasks(); let filter = 'all';
function saveTasks() { localStorage.setItem(keys.tasks, JSON.stringify(tasks)); }
function renderTasks() {
  const visible = tasks.filter(task => filter === 'all' || (filter === 'done' ? task.done : !task.done));
  $('#task-list').replaceChildren(); $('#empty-tasks').hidden = visible.length > 0;
  $('#task-count').textContent = `${visible.length} de ${tasks.length} tareas`;
  visible.forEach(task => {
    const li = document.createElement('li'); li.className = `task-item${task.done ? ' done' : ''}`; li.dataset.taskId = String(task.id);
    const label = document.createElement('label'); const input = document.createElement('input'); input.type = 'checkbox'; input.checked = task.done; input.setAttribute('aria-label', `Completar: ${task.title}`); input.addEventListener('change', () => { task.done = input.checked; saveTasks(); renderTasks(); });
    const span = document.createElement('span'); span.className = 'task-label'; span.textContent = task.title; label.append(input,span);
    const del = document.createElement('button'); del.type = 'button'; del.className = 'delete-task'; del.textContent = 'Eliminar'; del.setAttribute('aria-label', `Eliminar: ${task.title}`); del.addEventListener('click', () => { tasks = tasks.filter(item => item.id !== task.id); saveTasks(); renderTasks(); });
    li.append(label,del); $('#task-list').append(li);
  });
  $$('.filter').forEach(button => { const on = button.dataset.filter === filter; button.classList.toggle('active', on); button.setAttribute('aria-pressed', String(on)); });
}
$('#task-form').addEventListener('submit', event => { event.preventDefault(); const input = $('#task-title'); const title = input.value.trim(); if (!title) return show($('#task-error'), 'Escribe un título para la tarea.'); hide($('#task-error')); tasks.push({ id: Date.now() + Math.random(), title, done: false }); saveTasks(); filter = 'all'; input.value = ''; renderTasks(); });
$$('.filter').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; renderTasks(); }));
$('#clear-tasks').addEventListener('click', () => { tasks = demoTasks.map(task => ({ ...task })); saveTasks(); filter = 'all'; hide($('#task-error')); renderTasks(); });
renderTasks();
// INTENTIONAL BUG: business rule specifies >= 100, implementation uses > 100.
$('#discount-form').addEventListener('submit', event => {
  event.preventDefault(); const total = Number($('#purchase-total').value);
  if (!Number.isFinite(total) || total < 0 || $('#purchase-total').value === '') return show($('#discount-result'), 'Importe no válido.');
  const discounted = total > 100 ? total * 0.9 : total;
  show($('#discount-result'), `Total a pagar: ${discounted.toFixed(2)} €`);
});

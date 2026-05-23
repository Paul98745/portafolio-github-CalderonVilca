const input     = document.getElementById('task-input');
const addBtn    = document.getElementById('add-btn');
const taskList  = document.getElementById('task-list');
const emptyMsg  = document.getElementById('empty-state');
const clearBtn  = document.getElementById('clear-done');
const countEl   = document.getElementById('count-total');
const doneEl    = document.getElementById('count-done');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;

  countEl.textContent = total;
  doneEl.textContent  = done;

  emptyMsg.classList.toggle('visible', total === 0);
  clearBtn.classList.toggle('visible', done > 0);
}

function renderTask(task, index) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.index = index;

  const check = document.createElement('div');
  check.className = `task-check${task.done ? ' checked' : ''}`;
  check.title = task.done ? 'Marcar pendiente' : 'Completar';
  check.addEventListener('click', () => toggleDone(index));

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const del = document.createElement('button');
  del.className = 'task-delete';
  del.textContent = '×';
  del.title = 'Eliminar tarea';
  del.addEventListener('click', () => deleteTask(index));

  li.append(check, text, del);
  taskList.appendChild(li);
}

function render() {
  taskList.innerHTML = '';
  tasks.forEach((task, i) => renderTask(task, i));
  updateStats();
}

function addTask() {
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.style.borderColor = 'var(--danger)';
    setTimeout(() => (input.style.borderColor = ''), 800);
    return;
  }

  tasks.unshift({ text, done: false });
  saveTasks();
  render();

  input.value = '';
  input.focus();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
}

addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

clearBtn.addEventListener('click', clearDone);

render();

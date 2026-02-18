const STORAGE_KEY = 'simple_app_tasks';
let tasks = [];
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
}
function createListContainer() {
    if (document.getElementById('task-list')) return;
    const btn = document.querySelector('button[onclick="para()"]') || document.querySelector('button');
    const ul = document.createElement('ul');
    ul.id = 'task-list';
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    if (btn && btn.parentNode) btn.parentNode.insertBefore(ul, btn.nextSibling);
    else document.body.appendChild(ul);
}
function renderTasks() {
    createListContainer();
    const ul = document.getElementById('task-list');
    ul.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '8px';

        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = !!task.done;
        chk.dataset.action = 'toggle';

        const span = document.createElement('span');
        span.textContent = task.text;
        if (task.done) span.style.textDecoration = 'line-through';

        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.dataset.action = 'delete';

        li.appendChild(chk);
        li.appendChild(span);
        li.appendChild(del);
        ul.appendChild(li);
    });
}
function addTask(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    tasks.push({ id: Date.now().toString(), text: trimmed, done: false });
    saveTasks();
    renderTasks();
}
function para() {
    const input = document.querySelector('.now');
    if (!input) return;
    addTask(input.value);
    input.value = '';
    input.focus();
}
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    const input = document.querySelector('.now');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') para();
        });
    }

    document.body.addEventListener('click', (e) => {
        const action = e.target.dataset && e.target.dataset.action;
        if (!action) return;
        const li = e.target.closest('li');
        if (!li) return;
        const id = li.dataset.id;
        if (action === 'delete') {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        } else if (action === 'toggle') {
            const t = tasks.find(x => x.id === id);
            if (!t) return;
            t.done = e.target.checked;
            saveTasks();
            renderTasks();
        }
    });
});

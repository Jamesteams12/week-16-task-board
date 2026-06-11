const quote = document.querySelector('.quote');
const input = document.querySelector('#todo-input');
const form = document.querySelector('#todo-form');
const todo = document.querySelector('#to-do');
const busy = document.querySelector('#busy');
const done = document.querySelector('#done');

async function getQuote() {
    try {
        const response = await fetch('https://quoteslate.vercel.app/api/quotes/random?tags=motivation');
        const info = await response.json();
        quote.innerHTML = `
            <p><u>${info.quote}</u></p>
        `;
    } catch (err) {
        quote.textContent = 'Could not load quote.';
        console.error(err);
    }
};

function dragstartHandler(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
};

function dragoverHandler(ev) {
    ev.preventDefault();
};

function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    const task = document.getElementById(data);
    ev.currentTarget.appendChild(task);
    saveTasks();
};

[todo, busy, done].forEach(column => {
    column.addEventListener('dragover', dragoverHandler);
    column.addEventListener('drop', dropHandler);
});

form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    createTask(
        `task-${Date.now()}`,
        text,
        'to-do'
    );
    saveTasks();
    input.value = '';
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('[draggable="true"]').forEach(task => {
        const parent = task.parentElement.id;
        tasks.push({
            id: task.id,
            text: task.childNodes[0].textContent.trim(),
            status: parent
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTask(id, text, status) {
    const task = document.createElement('p');
    task.id = id;
    task.draggable = true;
    task.addEventListener('dragstart', dragstartHandler);
    task.textContent = text;
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', () => {
        task.remove();
        saveTasks();
    });
    task.appendChild(deleteBtn);
    document.getElementById(status).appendChild(task);
}

function loadTasks() {
    const storedTasks =
        JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => {
        createTask(task.id, task.text, task.status);
    });
}

getQuote();
loadTasks();
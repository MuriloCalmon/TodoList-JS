// Seleção de elementos
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const todoBar = document.querySelector('#toolbar');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const erasebtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInpuutValue;

//Funções

//Salvar um todo, cria toda estrutura html com js, e adiciona o titulo digitado

const controlFlexBlock = (todo) => {
    const windowWidth = window.innerWidth;

    if (windowWidth > 600) {
        todo.style.display = 'flex';
    }else {
        todo.style.display = 'block'
    }
}

const saveTodo = (text, done = false, save = 1) => {
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const titleTodo = document.createElement('h3');
    titleTodo.textContent = text;
    titleTodo.classList.add('title-todo')
    todo.appendChild(titleTodo);

    const todoButton = document.createElement('div')
    todoButton.classList.add('todo-button')

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('finish-todo');
    doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`
    todoButton.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo');
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`
    todoButton.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-todo');
    deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    todoButton.appendChild(deleteBtn);

    todo.appendChild(todoButton)


    if (done) {
        todo.classList.add('done');
    }

    //utilizando dados da localStorage
    if (save) {
        saveTodosLocalStorage({text, done})
    }
    //
    todoList.appendChild(todo);

    todoInput.value = '';
    todoInput.focus();
}

//Esconde ou mostra os formulários
const toogleForms = () => {
    todoForm.classList.toggle('hide');
    editForm.classList.toggle('hide');
    todoList.classList.toggle('hide');
    todoBar.classList.toggle('hide-tool-bar');
}

/* pega todos os todos, faz um foreach, adiciona ao titleTodo o titulo e se for 
igual ao oldInputValue já iniciado com o valor da tarefa selecionada para edição,
ele é alterado */
const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let titleTodo = todo.querySelector('h3')

        if (titleTodo.innerText === oldInpuutValue) {
            titleTodo.innerText = text;

            updateTodoLocaStorage(oldInpuutValue, text)
        }
    })
}



const getSearchTodos = (search) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let titleTodo = todo.querySelector('h3').innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        controlFlexBlock(todo)

        //se o titleTodo não tiver o que foi digitado na busca, esse todo receberá display de none
        if (!titleTodo.includes(normalizedSearch)) {
            todo.style.display = 'none';
        }
    });

}


const filterTodos = (filter) => {

    const todos = document.querySelectorAll('.todo');

    switch (filter) {
        case 'all':
            todos.forEach((todo) => {
                controlFlexBlock(todo)
            })
            break;
        case 'done':
            todos.forEach((todo) => todo.classList.contains('done') 
            ? controlFlexBlock(todo) 
            : todo.style.display = 'none');
            break;
        case 'todo':
            todos.forEach((todo) => todo.classList.contains('done') 
            ? todo.style.display = 'none' 
            : controlFlexBlock(todo));
            break;
        
        default:
            break;

    }
}


//Eventos

/* Evento disparado quando o usuário clicar no botão para adicionar uma nova tarefa */
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // obter o valor do input da tarefa
  const inputValue = todoInput.value;
  if (inputValue) {
    saveTodo(inputValue);
  }
})

// Fica escutando qualquer clique no documento, até o target for algum botão desejado para realizar uma ação
document.addEventListener('click', (e) => {

    const targetEl = e.target;
    const parentEl = targetEl.closest('div') // pega a div dos botões
    const todoList = parentEl.parentElement // pega a div do todoList
    let titleTodo = todoList.querySelector('h3')


    if (e.target.classList.contains('remove-todo')) {
        todoList.remove()


        removeTodoLocalStorage(titleTodo.innerText)
    }
    if (e.target.classList.contains('finish-todo')) {
        todoList.classList.toggle('done')
        
        updateTodosStatusLocalStorage(titleTodo.innerText);
    }

    if (e.target.classList.contains('edit-todo')) {
        toogleForms();

        editInput.value = titleTodo.innerText;
        // oldInputValue recebe o titleTodo para comparação de update
        oldInpuutValue = titleTodo.innerText;
    }
})

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toogleForms();
})


editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
        toogleForms();
    }else {
        alert('Prencha o campo para alterar')
    }

})


searchInput.addEventListener('keyup', (e) => {
    const search = e.target.value;

    getSearchTodos(search);
})

//O evento de keyup no searchinput, chama a função getSearchTodos, que coloca todos os todos em tela novamente
erasebtn.addEventListener('click', (e) => {
    e.preventDefault();

    searchInput.value = '';

    searchInput.dispatchEvent(new Event('keyup'));
})

filterBtn.addEventListener('change', (e) => {
    const filter = e.target.value;

    filterTodos(filter);
});

//local Storage

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || []

    return todos;
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })

}

const saveTodosLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem('todos', JSON.stringify(filteredTodos))
}

const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem('todos', JSON.stringify(todos))

}

const updateTodoLocaStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText) : null)

    localStorage.setItem('todos', JSON.stringify(todos))

}
//carrega todos os todos do local storage na tela
loadTodos()
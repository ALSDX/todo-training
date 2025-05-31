'use strict';

import { getElementFromLocalStorage, saveToLocalStorage, datePreparation } from "./utilities.js";

const addTodoInput = document.querySelector("[data-todo-add-input]");
const addTodoBtn = document.querySelector("[data-todo-add-btn]");
const removeAllTodosBtn = document.querySelector("[data-todo-removeAll-btn]");
const searchTodoInput = document.querySelector("[data-todo-search-input]");
const todoContainer = document.querySelector("[data-todo-container]");
const todoTemplate = document.querySelector("[data-todo-template]");

let todoList = getElementFromLocalStorage();
let filterTodoList = [];

addTodoBtn.addEventListener("click", () => {
    if (addTodoInput.value.trim()) {
        const newTodo = {
            id: Date.now(),
            text: addTodoInput.value.trim(),
            complete: false,
            createdAt: datePreparation(new Date())
        }
        todoList.push(newTodo);
        addTodoInput.value = '';
    }
    saveToLocalStorage(todoList);
    renderTodos();
});

addTodoInput.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        addTodoBtn.click();
    }
})

addTodoInput.addEventListener("input", () => {
    if (searchTodoInput.value.trim()) {
        searchTodoInput.value = '';
        renderTodos();
    }
});

searchTodoInput.addEventListener("input", (e) => {
    const searchValue = e.target.value.trim();

    filterAndRenderFilteredTodos(searchValue);
});

removeAllTodosBtn.addEventListener("click", () => {
    todoList = todoList.filter((todo) => !todo.complete);
    saveToLocalStorage(todoList);

    if (searchTodoInput.value.trim()) {
        filterAndRenderFilteredTodos(searchTodoInput.value.trim());
    } else {
        renderTodos();
    }
})

const filterAndRenderFilteredTodos = (searchValue) => {
    filterTodoList = todoList.filter((todo) => todo.text.includes(searchValue.toLowerCase()));

    renderFilterTodos()
}

const updateRemoveCompleteBtnState = () => {
    const hasCompleteTodos = todoList.some((todo) => todo.complete);
    removeAllTodosBtn.disabled = !hasCompleteTodos;

}

const createLayout = (todo) => {
    const todoElement = document.importNode(todoTemplate.content, true);

    const checkbox = todoElement.querySelector("[data-todo-checkbox]");
    checkbox.checked = todo.complete;

    const todoText = todoElement.querySelector("[data-todo-text]");
    todoText.textContent = todo.text;

    const todoDate = todoElement.querySelector("[data-todo-date]");
    todoDate.textContent = todo.createdAt;

    const removeBtn = todoElement.querySelector("[data-todo-remove-btn]");
    removeBtn.disabled = !todo.complete;

    checkbox.addEventListener("change", (e) => {
        todoList = todoList.map((t) => {
            if (t.id === todo.id) {
                t.complete = e.target.checked;
            }
            return t;
        });
        saveToLocalStorage(todoList);
        if (searchTodoInput.value.trim()) {
            filterAndRenderFilteredTodos(searchTodoInput.value.trim());
        } else {
            renderTodos();
        }
    });

    removeBtn.addEventListener("click", () => {
        todoList = todoList.filter((t) => {
            if (t.id !== todo.id) {
                return t;
            }
        });
        saveToLocalStorage(todoList);
        if (searchTodoInput.value.trim()) {
            filterAndRenderFilteredTodos(searchTodoInput.value.trim());
        } else {
            renderTodos();
        }
    })

    return todoElement;
}

const renderTodos = () => {
    todoContainer.innerHTML = '';

    if (todoList.length === 0) {
        todoContainer.innerHTML = '<h3 class="container__title">No todos...</h3>';
        return;
    }

    todoList.forEach((todo) => {
        const todoElement = createLayout(todo);
        todoContainer.append(todoElement);
    })

    updateRemoveCompleteBtnState()
}
const renderFilterTodos = () => {
    todoContainer.innerHTML = '';

    if (filterTodoList.length === 0) {
        todoContainer.innerHTML = '<h3 class="container__title">No todos...</h3>';
        return;
    }

    filterTodoList.forEach((todo) => {
        const todoElement = createLayout(todo);
        todoContainer.append(todoElement);
    })

    updateRemoveCompleteBtnState()
}

renderTodos()
updateRemoveCompleteBtnState()
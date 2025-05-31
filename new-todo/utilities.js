const TODOS_KEY = 'todos';

export const getElementFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
}

export const saveToLocalStorage = (todo) => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todo));
}

export const datePreparation = (date) => {
    return Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).format(date);
}
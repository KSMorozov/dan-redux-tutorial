import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

// Todo Reducer.
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      return state.id === action.id ? { ...state, completed: !state.completed } : state;
    default:
      return state;
  }
};

// Todos Reducer.
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action),
      ];
    case 'TOGGLE_TODO':
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

// Visibility Filter Reducer.
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// Reducer Composition pattern
const todoApp = combineReducers({ todos, visibilityFilter });
const store = createStore(todoApp);

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter((t) => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
};

let id = 0;
const next = () => id++;

// Todo Component
const Todo = ({ completed, text, onClick }) =>
  <li
    style={{ textDecoration: completed ? 'line-through' : 'none' }}
    onClick={onClick}
  >
    {text}
  </li>;

Todo.propTypes = {
  completed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

// TodoList Component.
const TodoList = ({ todos, onTodoClick }) =>
  <ul>
    {todos.map((todo) =>
        <Todo
          onClick={() => onTodoClick(todo.id)}
          key={todo.id}
          {...todo}
        />
    )}
  </ul>;

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  onTodoClick: PropTypes.func.isRequired,
};

// Filter Component
const FilterLink = ({ filter, children, currentFilter }) => (
    filter === currentFilter
    ? <span>{children}</span>
    : <a href="#"
      onClick={(e) => (
        e.preventDefault()
        || store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter })
      )}
    >
      {children}
    </a>
);

FilterLink.propTypes = {
  children: PropTypes.node.isRequired,
  filter: PropTypes.string.isRequired,
  currentFilter: PropTypes.string.isRequired,
};

// App Component
class App extends Component {
  render() {
    const { todos, visibilityFilter } = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return (
      <div>
        <form
          onSubmit={(e) =>
            (e.preventDefault()
            || store.dispatch({ type: 'ADD_TODO', text: this.input.value, id: next() })
            && (this.input.value = ''))
          }
        >
          <input ref={(node) => (this.input = node)}></input>
          <button type="submit">
            Add Todo
          </button>
        </form>
        <TodoList
          todos={visibleTodos}
          onTodoClick={(id) => store.dispatch({ type: 'TOGGLE_TODO', id })}
        />
        <p>
          Show:
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
            All
          </FilterLink>
          {' '}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
            Active
          </FilterLink>
          {' '}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  visibilityFilter: PropTypes.string.isRequired,
};

// Render function
const render = () => {
  ReactDOM.render(<App
    {...store.getState()}
  />, document.getElementById('root'));
};

// Subscribe to Store.
store.subscribe(render);
render();

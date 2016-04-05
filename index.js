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

let id = 0;
const next = () => id++;

const Todo = ({ todo }) =>
  <li
    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    onClick={() => store.dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
  >
    {todo.text}
  </li>;

Todo.propTypes = {
  todo: PropTypes.object.isRequired,
};

class App extends Component {
  render() {
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
        <ul>
          {this.props.todos.map((td) => <Todo key={td.id} todo={td} />)}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
};

const render = () => {
  ReactDOM.render(<App
    todos={store.getState().todos}
  />, document.getElementById('root'));
};

store.subscribe(render);
render();

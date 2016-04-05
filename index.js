import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { createStore } from 'redux';

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

// Reimplementing combineReducers function
const combineReducers = (reducers) =>
  (state = {}, action) =>
    Object.keys(reducers)
      .reduce((nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      }, {});

// Reducer Composition pattern
const todoApp = combineReducers({ todos, visibilityFilter });

const store = createStore(todoApp);

console.log('Initial state:');
console.log(store.getState());
console.log('-----------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux',
});
console.log('Current state:');
console.log(store.getState());
console.log('------------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping',
});
console.log('Current state:');
console.log(store.getState());
console.log('------------------');

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0,
});
console.log('Current state:');
console.log(store.getState());
console.log('------------------');

console.log('Dispatching SET_VISIBILITY_FILTER.');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED',
});
console.log('Current state:');
console.log(store.getState());
console.log('------------------');

// Test for Add todo action.
const testAddTodo = () => {
  const stateBefore = [];

  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux',
  };

  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action))
    .toEqual(stateAfter);
};

// Test for Toggle todo action.
const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: false,
    },
  ];

  const action = {
    type: 'TOGGLE_TODO',
    id: 1,
  };

  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false,
    },
    {
      id: 1,
      text: 'Go shopping',
      completed: true,
    },
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action))
    .toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('All test passed.');

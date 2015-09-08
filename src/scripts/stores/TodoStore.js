import { EventEmitter } from 'events';
import update from 'react/lib/update';
import AppDispatcher from '../dispatcher/AppDispatcher';
import TodoConstants from '../constants/TodoConstants';

const CHANGE_EVENT = 'change';

var _todos = [];

const _addTodo = (content) => {
  _todos = update(_todos, {
    $push: [{
      id: _todos.length + 1,
      content,
      completed: false
    }]
  });
};

const _toggleTodo = (id) => {
  const idx = _todos.findIndex((todo) => todo.id === id);

  _todos = update(_todos, {
    [idx]: {
      completed: { $set: !_todos[idx].completed }
    }
  });
};

const _editTodo = (id, content) => {
  const idx = _todos.findIndex((todo) => todo.id === id);

  _todos = update(_todos, {
    [idx]: {
      content: { $set: content }
    }
  });
};

const _deleteTodo = (id) => {
  const idx = _todos.findIndex((todo) => todo.id === id);

  _todos = update(_todos, {
    $splice: [[idx, 1]]
  })
};

const TodoStore = {
  ...EventEmitter.prototype,

  getAll() {
    return _todos;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.actionType) {
      case TodoConstants.CREATE:
        _addTodo(action.content);
        TodoStore.emitChange();
        break;

      case TodoConstants.TOGGLE:
        _toggleTodo(action.id);
        TodoStore.emitChange();
        break;

      case TodoConstants.UPDATE:
        _editTodo(action.id, action.content);
        TodoStore.emitChange();
        break;

      case TodoConstants.DELETE:
        _deleteTodo(action.id);
        TodoStore.emitChange();
        break;
    }

    return true;
  })
};

module.exports = TodoStore;
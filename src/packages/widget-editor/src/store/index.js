import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import sagas from "sagas";

// New modules
import { handleModule } from "vizzuality-redux-tools";

// Modules
import * as editor from "modules/editor";

const sagaMiddleware = createSagaMiddleware();

const initStore = (initialState = {}) => {
  const reducers = combineReducers({
    editor: handleModule(editor)
  });

  const middlewares = applyMiddleware(thunk, sagaMiddleware);
  const enhancers = composeWithDevTools(middlewares);

  // create store
  const store = createStore(reducers, initialState, enhancers);

  sagaMiddleware.run(sagas);

  return { store };
};

export default initStore;

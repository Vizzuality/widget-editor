import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import sagas from "sagas";

// New modules
import { handleModule } from "vizzuality-redux-tools";

// Modules
import * as editor from "modules/editor";
import * as theme from "modules/theme";
import * as widget from "modules/widget";
import * as configuration from "modules/configuration";

const sagaMiddleware = createSagaMiddleware();

const initStore = (initialState = {}) => {
  const reducers = combineReducers({
    configuration: handleModule(configuration),
    editor: handleModule(editor),
    theme: handleModule(theme),
    widget: handleModule(widget)
  });

  const middlewares = applyMiddleware(thunk, sagaMiddleware);
  const enhancers = composeWithDevTools(middlewares);

  // create store
  const store = createStore(reducers, initialState, enhancers);

  sagaMiddleware.run(sagas);

  return { store };
};

export default initStore;

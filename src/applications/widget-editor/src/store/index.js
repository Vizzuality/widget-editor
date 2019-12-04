import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import thunk from "redux-thunk";

// New modules
import { handleModule } from "vizzuality-redux-tools";

// Modules
import * as editor from "modules/editor";

const initStore = (initialState = {}) => {
  const reducers = combineReducers({
    editor: handleModule(editor)
  });

  const middlewares = applyMiddleware(thunk);
  const enhancers = composeWithDevTools(middlewares);

  // create store
  const store = createStore(reducers, initialState, enhancers);

  return { store };
};

export default initStore;

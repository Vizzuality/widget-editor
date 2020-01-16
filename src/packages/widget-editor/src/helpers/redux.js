import { connect } from "react-redux";
import { createAction as VzCreateAction } from "vizzuality-redux-tools";

// This is the namespace of the widget editor
// We are namespacing the widget editor to avoid data conflicts
export const APP_NAMESPACE = "widgetEditor";

/*
  REDUX util to connect to our state

  As the widget editor is namespaced in the consumer app
  this will make it easier to develop for us and only care about the state of the widget editor
*/
export const connectState = (stateHandler, dispatchHandler) => {
  return connect(
    state =>
      typeof stateHandler === "function"
        ? stateHandler(state[APP_NAMESPACE])
        : {},
    dispatchHandler
  );
};

// Create redux actions that namespaces the widget editor
export const createAction = action =>
  VzCreateAction(`${APP_NAMESPACE}/${action}`);

// Gets an action with our namespace. used for our sagas
export const getAction = action => `${APP_NAMESPACE}/${action}`;

export default {
  APP_NAMESPACE,
  connectState,
  createAction,
  getAction
};

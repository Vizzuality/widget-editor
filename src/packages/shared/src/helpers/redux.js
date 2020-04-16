import { connect } from "react-redux";
import { createAction as VzCreateAction } from "vizzuality-redux-tools";

import { constants } from "@widget-editor/core";

/*
  REDUX util to connect to our state

  As the widget editor is namespaced in the consumer app
  this will make it easier to develop for us and only care about the state of the widget editor
*/
export const connectState = (stateHandler, dispatchHandler) => {
  return connect(
    (state) =>
      typeof stateHandler === "function"
        ? stateHandler(state[constants.APP_NAMESPACE])
        : {},
    dispatchHandler
  );
};

// Create redux actions that namespaces the widget editor
export const createAction = (action) =>
  VzCreateAction(`${constants.APP_NAMESPACE}/${action}`);

// Gets an action with our namespace. used for our sagas
export const getAction = (action) => `${constants.APP_NAMESPACE}/${action}`;

export default {
  connectState,
  createAction,
  getAction,
};

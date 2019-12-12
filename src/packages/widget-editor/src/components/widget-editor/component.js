import React from "react";
import { Provider } from "react-redux";

import Editor from "components/editor";

import configureStore from "store";

// XXX: This would be the public facing component
const WidgetEditor = ({ adapter }) => {
  const { store } = configureStore();

  if (typeof adapter === "undefined") {
    console.error("WidgetEditor requires a prop: adapter");
  }

  return (
    <Provider store={store}>
      <Editor adapter={adapter} />
    </Provider>
  );
};

export default WidgetEditor;

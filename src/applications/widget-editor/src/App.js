import React, { useState } from "react";
import { Provider } from "react-redux";

import configureStore from "store";

import Editor from "components/editor";
import EditorOptions from "components/editor-options";

import "./App.css";

function App() {
  const { store } = configureStore();
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          Widget editor
          <EditorOptions />
        </header>
        <Editor />
      </div>
    </Provider>
  );
}

export default App;

import React from "react";
import { Provider } from "react-redux";
import configureStore from "store";

import logo from "./logo.svg";
import "./App.css";

import Editor from "components/editor";

function App() {
  const { store } = configureStore();
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Widget Editor from RWAdapter.</p>
          <Editor />
        </header>
      </div>
    </Provider>
  );
}

export default App;

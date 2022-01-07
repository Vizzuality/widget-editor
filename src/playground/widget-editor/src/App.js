import React from "react";
import { Provider } from "react-redux";

import configureStore from "store";

import Header from "components/header";
import Editor from "./components/editor";
import EditorForm from "components/editor-form";

import "./App.scss";
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const { store } = configureStore();

  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <EditorForm />
        <Editor />
      </div>
    </Provider>
  );
}

export default App;

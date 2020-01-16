import React, { useState } from "react";
import { Provider } from "react-redux";

import configureStore from "store";

import "./App.css";

// TODO: these would be combined
import RwAdapter from "@packages/rw-adapter";
import WidgetEditor from "@packages/widget-editor";

function App() {
  const { store } = configureStore();

  const theme = { color: "#C32D7B" };

  const adapter = new RwAdapter(
    {
      applications: ["rw"],
      env: "production",
      locale: "en",
      includes: ["metadata", "vocabulary", "widget", "layer"]
    },
    "a86d906d-9862-4783-9e30-cdb68cd808b8"
  );

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">Widget editor V2</header>
        <div className="widget-editor-wrapper">
          <WidgetEditor adapter={adapter} theme={theme} store={store} />
        </div>
      </div>
    </Provider>
  );
}

export default App;

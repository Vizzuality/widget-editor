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
    "03bfb30e-829f-4299-bab9-b2be1b66b5d4"
  );

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">Widget editor</header>
        <div className="widget-editor-wrapper">
          <WidgetEditor adapter={adapter} theme={theme} store={store} />
        </div>
      </div>
    </Provider>
  );
}

export default App;

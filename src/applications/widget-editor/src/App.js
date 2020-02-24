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

  const handleOnSave = diff => {
    console.log("on save called from consumer with:");
    console.log(diff);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">Widget editor</header>
        <div className="widget-editor-wrapper">
          <WidgetEditor
            datasetId="03bfb30e-829f-4299-bab9-b2be1b66b5d4"
            onSave={handleOnSave}
            authenticated={true}
            adapter={RwAdapter}
            theme={theme}
            store={store}
          />
        </div>
      </div>
    </Provider>
  );
}

export default App;

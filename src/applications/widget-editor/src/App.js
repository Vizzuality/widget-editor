import React from "react";

import "./App.css";

// TODO: these would be combined
import RwAdapter from "@packages/rw-adapter";
import WidgetEditor from "components/widget-editor";

function App() {
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
    <div className="App">
      <header className="App-header">Widget editor V2</header>
      <div className="widget-editor-wrapper">
        <WidgetEditor adapter={adapter} />
      </div>
    </div>
  );
}

export default App;

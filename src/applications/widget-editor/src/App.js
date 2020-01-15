import React, { useState } from "react";

import "./App.css";

// TODO: these would be combined
import RwAdapter from "@packages/rw-adapter";
import WidgetEditor from "@packages/widget-editor";

import { GithubPicker } from "react-color";

function App() {
  const [colorPickerActive, setColorPickerActive] = useState(false);
  const [theme, setTheme] = useState({ color: "#C32D7B" });
  const handleChangeTheme = gp => {
    setTheme({ color: gp.hex });
  };

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
      <header className="App-header">
        Widget editor V2
        <div
          className="App-set-theme"
          onClick={() => setColorPickerActive(!colorPickerActive)}
        >
          <span className="theme-preview" style={{ background: theme.color }} />
          <h4>Test Theme</h4>
          {colorPickerActive && (
            <GithubPicker onChangeComplete={handleChangeTheme} theme="Github" />
          )}
        </div>
      </header>
      <div className="widget-editor-wrapper">
        <WidgetEditor adapter={adapter} theme={theme} />
      </div>
    </div>
  );
}

export default App;

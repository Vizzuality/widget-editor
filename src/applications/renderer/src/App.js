import React from "react";
import logo from "./logo.svg";
import "./App.css";

import RwAdapter from "@packages/rw-adapter";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>App Renderer from RWAdapter.</p>
      </header>
    </div>
  );
}

export default App;

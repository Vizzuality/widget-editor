import React from "react";
import logo from "./logo.svg";
import "./App.css";

import RwAdapter from "@packages/rw-adapter";

function App() {
  const testAdapter = new RwAdapter("Hello world");

  console.log("test adapter", testAdapter.print());

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          App Renderer <code>{testAdapter.print()}</code> from RWAdapter.
        </p>
      </header>
    </div>
  );
}

export default App;

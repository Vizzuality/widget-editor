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
          Widget Editor <code>{testAdapter.print()}</code> from RWAdapter.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

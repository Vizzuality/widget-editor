import React from "react";
import logo from "./logo.svg";
import "./App.css";

import RwAdapter from "@packages/rw-adapter";

function App() {
  const testAdapter = new RwAdapter(
    {
      url: "https://api.resourcewatch.org/v1",
      applications: ["rw"],
      env: "production",
      locale: "en",
      includes: ["metadata", "vocabulary", "widget", "layer"]
    },
    "a86d906d-9862-4783-9e30-cdb68cd808b8"
  );
  testAdapter.getData().then(data => {
    console.log("get data", data);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Widget Editor from RWAdapter.</p>
      </header>
    </div>
  );
}

export default App;

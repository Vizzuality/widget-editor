import React, { Fragment, useState } from "react";
import { Provider } from "react-redux";
import { RiLoginBoxLine, RiMistLine, RiPaletteLine } from 'react-icons/ri';

import configureStore from "store";

import Editor from "./components/editor";
import DebugOption from "components/debug-options";
import EditorOptions from "components/editor-options";
import PlaygroundRenderer from "components/playground-renderer";
import EditorForm from "components/editor-form";

import "./App.scss";

function App() {
  const { store } = configureStore();
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isRenderer, setIsRenderer] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null);

  const handleSetRenderer = () => {
    if (!isRenderer) {
      setActiveWidget(store.getState().widgetEditor.editor.widget);
    } else {
      setActiveWidget(null);
    }
    setIsRenderer(!isRenderer);
  };

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          Widget editor
          <div className="App-header--nav">
            <button type="button" onClick={() => handleSetRenderer()}>
              {isRenderer ? <RiMistLine /> : <RiPaletteLine /> } {isRenderer ? "View editor" : "View renderer"}
            </button>
            <button type="button" onClick={() => setIsUnmounted(!isUnmounted)}><RiLoginBoxLine /> Toggle un-mounting</button>
            <DebugOption />
          </div>
        </header>
        <EditorForm />
        {!isRenderer && !isUnmounted && (
          <Fragment>
            <Editor />
            <EditorOptions />
          </Fragment>
        )}
        {!isRenderer && isUnmounted && <div className="c-unmounted">
            <p>Editor is unmounted.</p>
            <span>Redux dev tools wont show updates, so if you need to debug redux you need to refresh your browser. But in this context you can make sure that the editor does not crash and cancels all necessary events when un-mounting the editor.</span>
          </div>}
        {isRenderer && <PlaygroundRenderer activeWidget={activeWidget} />}
      </div>
    </Provider>
  );
}

export default App;

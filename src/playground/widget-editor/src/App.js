import React, { Fragment, useState } from "react";
import { Provider } from "react-redux";

import configureStore from "store";

import { getEditorState, ModifyEditorState } from "@widget-editor/widget-editor";

import Editor from "./components/editor";
import EditorOptions from "components/editor-options";
import ToggleOptions from "components/toggle-options";
import PlaygroundRenderer from "components/playground-renderer";

import "./App.css";

function App() {
  const { store } = configureStore();
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
          Widget editor playground
          <ToggleOptions />
          <button type="button" onClick={() => handleSetRenderer()}>
            {isRenderer ? "View editor" : "View renderer"}
          </button>
          <button type="button" onClick={() => console.log(getEditorState())}>
            Get Editor state hook
          </button>
          <button type="button" onClick={() => console.log(ModifyEditorState({ description: 'Hello'}))}>
            Modify Editor state hook
          </button>
        </header>
        {!isRenderer && (
          <Fragment>
            <Editor />
            <EditorOptions />
          </Fragment>
        )}
        {isRenderer && <PlaygroundRenderer activeWidget={activeWidget} />}
      </div>
    </Provider>
  );
}

export default App;

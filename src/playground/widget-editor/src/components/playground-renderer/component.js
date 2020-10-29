import React from "react";
import { useSelector } from 'react-redux'

import RwAdapter from "@widget-editor/rw-adapter";
import Renderer from "@widget-editor/renderer";

// eslint-disable-next-line
import widgetTest from "./test-widget";

const PlaygroundRenderer = () => {
  const widget = useSelector(state => {
    return state.widgetEditor.widgetConfig;
  });

  if (!widget) {
    return (
      <div className="c-unmounted">
        <p>No modified styles found</p>
        <span>Update your widget within the editor and your changes will be reflected here</span>
      </div>
    )
  }

  return (
    <div className="column">
      <div className="c-widget-block">
        <div className="renderer-wrapper">
          <Renderer
            adapter={RwAdapter}
            thumbnail={false}
            widgetConfig={widget}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundRenderer;

import React from "react";

import Renderer from "@widget-editor/renderer";

// eslint-disable-next-line
import widgetTest from "./test-widget";

const PlaygroundRenderer = ({ activeWidget }) => {
  if (!activeWidget) {
    return "Loading renderer...";
  }

  return (
    <div className="column">
      <div className="c-widget-block">
        <div className="renderer-wrapper">
          <Renderer
            thumbnail={false}
            // widgetConfig={widgetTest.data.attributes.widgetConfig}
            widgetConfig={activeWidget.attributes.widgetConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundRenderer;

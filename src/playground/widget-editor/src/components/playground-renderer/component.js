import React from "react";

import Renderer from "@widget-editor/renderer";

const PlaygroundRenderer = ({ activeWidget }) => {
  if (!activeWidget) {
    return "Loading renderer...";
  }

  return (
    <div className="renderer-wrapper">
      <Renderer
        thumbnail={true}
        widgetConfig={activeWidget.attributes.widgetConfig}
      />
    </div>
  );
};

export default PlaygroundRenderer;

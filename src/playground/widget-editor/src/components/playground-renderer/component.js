import React from "react";

import Renderer from "@widget-editor/renderer";

const PlaygroundRenderer = ({ activeWidget }) => {
  if (!activeWidget) {
    return "Loading renderer...";
  }

  return <Renderer widgetConfig={activeWidget.attributes.widgetConfig} />;
};

export default PlaygroundRenderer;

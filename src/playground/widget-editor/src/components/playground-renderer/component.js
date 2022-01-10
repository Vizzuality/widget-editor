import React from "react";
import { useSelector } from 'react-redux'
import { getOutputPayload } from '@widget-editor/core';

import RwAdapter from "@widget-editor/rw-adapter";
import Renderer from "@widget-editor/renderer";

import providers from '../editor/mapbox-providers';

import {
  MAPSTYLES,
  VIEWPORT
} from '../editor/map-config';

const PlaygroundRenderer = () => {
  // Returns the currently modified widget in the renderer
  const widgetConfig = useSelector(state => {
    return getOutputPayload(state.widgetEditor, window.WE_adapter)?.widgetConfig;
  });
  
  if (!widgetConfig) {
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
            widgetConfig={widgetConfig}
            map={{
              MAPSTYLES,
              VIEWPORT,
              providers,
              mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundRenderer;

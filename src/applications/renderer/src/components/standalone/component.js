import React, { Fragment, Suspense } from "react";

import { getDefaultTheme } from "@widget-editor/core";
import useLayerData from "./fetch-layers-hook";

import Legend from './legend';

const Chart = React.lazy(() => import("../chart"));
const Map = React.lazy(() => import("@widget-editor/map"));

const Standalone = ({
  adapter,
  thumbnail,
  widgetConfig,
  changeBbox,
  interactionEnabled,
  widgetName
}) => {
  const isMap = widgetConfig?.paramsConfig?.visualizationType === "map";
  const { layerData, isLoadingLayers, isErrorLayers } = useLayerData(
    adapter,
    widgetConfig?.paramsConfig?.layer,
    isMap
  );

  if (isLoadingLayers) {
    return "Loading...";
  }

  if (isErrorLayers) {
    return "Error loading widget...";
  }

  let wConfig = widgetConfig || {};

  wConfig.autosize = {
    type: "fit",
    contains: "padding",
  };

  wConfig.width = wConfig.width || 400;
  wConfig.height = wConfig.height || 500;

  wConfig.config = {
    ...getDefaultTheme(),
    ...(wConfig.config ? wConfig.config : {}),
  };

  return (
    <Fragment>
      {!isMap && (
        <Suspense>
          {widgetConfig.hasOwnProperty('legend') && widgetConfig?.legend?.length > 0 && !thumbnail
            && <Legend widgetConfig={widgetConfig}/>}
          <Chart
            thumbnail={thumbnail}
            standalone
            standaloneConfiguration={wConfig}
          />
        </Suspense>
      )}
      {isMap && (
        <Suspense>
          <Map
            adapter={new adapter()}
            layerId={widgetConfig?.paramsConfig?.layer}
            thumbnail={thumbnail}
            widget={{
              attributes: {
                widgetConfig,
              },
            }}
            mapConfiguration={{
              lat: widgetConfig.lat || 0,
              lng: widgetConfig.lng || 0,
              bbox: widgetConfig.bbox || 0,
              zoom: widgetConfig.zoom || 2,
              basemap: widgetConfig.basemapLayers || null,
            }}
            caption={widgetName}
            layers={[layerData]}
            changeBbox={changeBbox}
            interactionEnabled={interactionEnabled}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Standalone;

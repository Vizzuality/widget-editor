import React, { Fragment, Suspense } from "react";

import useLayerData from "./fetch-layers-hook";

import defaultConfig from "./constants";

const Chart = React.lazy(() => import("../chart"));
const Map = React.lazy(() => import("@widget-editor/map"));

const Standalone = ({ thumbnail, widgetConfig, adapter, theme }) => {
  const isMap = widgetConfig.type === "map";

  const [{ layerData, isLoadingLayers, isErrorLayers }] = useLayerData(
    widgetConfig?.layer_id,
    isMap
  );

  if (isLoadingLayers) {
    return "Loading...";
  }

  if (isErrorLayers) {
    return "Error loading widget...";
  }

  let wConfig = widgetConfig || {};

  wConfig.autosize = wConfig.autosize
    ? wConfig.autosize
    : {
        type: "fit",
        contains: "padding",
      };

  wConfig.width = wConfig.width || 400;
  wConfig.height = wConfig.width || 500;

  wConfig.config = {
    ...defaultConfig,
    ...(wConfig.config ? wConfig.config : {}),
  };

  return (
    <Fragment>
      {!isMap && (
        <Suspense>
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
            }}
            caption={widgetConfig?.paramsConfig?.caption || null}
            layers={[layerData]}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Standalone;

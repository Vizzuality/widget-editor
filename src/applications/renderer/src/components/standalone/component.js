import React, { Fragment, Suspense } from "react";

import useWidgetData from "./fetch-data-hook";
import useLayerData from "./fetch-layers-hook";

const Chart = React.lazy(() => import("../chart"));
const Map = React.lazy(() => import("@widget-editor/map"));

const Standalone = ({ widgetConfig, adapter, theme }) => {
  const isMap = widgetConfig.type === "map";

  const [{ data, isLoading, isError }] = useWidgetData(
    widgetConfig,
    theme,
    isMap
  );

  const [{ layerData, isLoadingLayers, isErrorLayers }] = useLayerData(
    widgetConfig?.layer_id,
    isMap
  );

  if (isLoading || isLoadingLayers) {
    return "Loading...";
  }

  if (isError || isErrorLayers) {
    return "Error loading widget...";
  }

  return (
    <Fragment>
      {!isMap && (
        <Suspense>
          <Chart standalone standaloneConfiguration={data} />
        </Suspense>
      )}
      {isMap && (
        <Suspense>
          <Map
            setMapParams={() => {}}
            widget={{
              attributes: {
                widgetConfig,
              },
            }}
            layers={[layerData]}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Standalone;

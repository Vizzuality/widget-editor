import React, { Suspense, useMemo } from "react";
import PropTypes from 'prop-types';
import has from 'lodash/has';
import { getDefaultTheme } from "@widget-editor/core";
import Map from "@widget-editor/map";

import Legend from "components/legend";
import Chart from "components/chart";
import useLayerData from "./fetch-layers-hook";

const Renderer = ({
  adapter,
  map,
  widgetConfig,
  thumbnail = false,
  interactionEnabled = true,
}) => {
  if (typeof adapter !== "function") {
    throw new Error("Renderer: Missing prop adapter and adapter needs to be of type Adapter");
  }

  const adapterInstance = useMemo(() => new adapter(), [adapter]);

  const isMap = widgetConfig?.paramsConfig?.visualizationType === "map";
  const { layerData, isLoadingLayers, isErrorLayers } = useLayerData(
    adapter,
    widgetConfig?.paramsConfig?.layer,
    isMap
  );

  const chartWidgetConfig = useMemo(() => {
    const res = { ...widgetConfig };

    res.autosize = {
      type: "fit",
      contains: "padding",
    };

    res.width = res.width || 400;
    res.height = res.height || 500;

    res.config = {
      ...getDefaultTheme(),
      ...(res.config ? res.config : {}),
    };

    return res;
  }, [widgetConfig]);

  const hasChartLegend = has(chartWidgetConfig, 'legend')
    && chartWidgetConfig?.legend?.length > 0
    && !thumbnail;

  if (isLoadingLayers) {
    return "Loading...";
  }

  if (isErrorLayers) {
    return "Error loading widget...";
  }

  return (
    <>
      {!isMap && (
        <Suspense>
          {hasChartLegend && <Legend widgetConfig={chartWidgetConfig}/>}
          <Chart widgetConfig={chartWidgetConfig} thumbnail={thumbnail} />
        </Suspense>
      )}
      {isMap && (
        <Suspense>
            <Map
              adapter={adapterInstance}
              layerId={widgetConfig.paramsConfig?.layer}
              thumbnail={thumbnail}
              mapConfiguration={{
                lat: widgetConfig.lat || 0,
                lng: widgetConfig.lng || 0,
                bbox: widgetConfig.bbox,
                zoom: widgetConfig.zoom || 2,
                basemap: widgetConfig.basemapLayers || null,
              }}
              layers={layerData ? [layerData] : []}
              interactionEnabled={interactionEnabled}
              map={map}
            />
        </Suspense>
      )}
    </>
  );
};

Renderer.propTypes = {
  adapter: PropTypes.func.isRequired,
  widgetConfig: PropTypes.object.isRequired,
  thumbnail: PropTypes.bool,
  interactionEnabled: PropTypes.bool,
  map: PropTypes.shape({
    MAPSTYLES: PropTypes.string,
    VIEWPORT: PropTypes.object,
    providers: PropTypes.object,
    mapboxToken: PropTypes.string
  })
};

export default Renderer;

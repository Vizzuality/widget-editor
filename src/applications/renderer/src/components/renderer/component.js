import React, { Suspense } from "react";

import {
  StyledContainer,
  RestoringWidget,
  RestoringWidgetTitle,
} from "./style";

const Chart = React.lazy(() => import("../chart"));
const SelectChart = React.lazy(() => import("../select-chart"));
const ChartColorFilter = React.lazy(() => import("../chart-color-filter"));
const Standalone = React.lazy(() => import("../standalone"));

const Map = React.lazy(() => import("@widget-editor/map"));

// -- If a widget config is suplied, we are consuming the renderer outside of the editor
const Renderer = ({
  widget,
  editor,
  widgetConfig = null,
  standalone = true,
  theme = null,
  thumbnail = false,
  configuration,
  compact,
}) => {
  const { restoring, initialized } = editor;
  const missingWidget =
    initialized && !restoring && Object.keys(widget).length === 0;

  const isMap = configuration.visualizationType === "map";

  if (restoring) {
    return (
      <StyledContainer>
        <RestoringWidget>
          <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
        </RestoringWidget>
      </StyledContainer>
    );
  }

  if (standalone) {
    return (
      <Suspense
        fallback={
          <RestoringWidget>
            <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
          </RestoringWidget>
        }
      >
        <Standalone
          thumbnail={thumbnail}
          widgetConfig={widgetConfig}
          theme={theme}
        />
      </Suspense>
    );
  }

  return (
    <StyledContainer compact={compact}>
      {!widgetConfig && initialized && !configuration.rasterOnly && (
        <Suspense fallback={<div>Loading...</div>}>
          <SelectChart />
        </Suspense>
      )}

      {initialized && !restoring && !missingWidget && !isMap && (
        <Suspense
          fallback={
            <RestoringWidget>
              <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
            </RestoringWidget>
          }
        >
          <Chart compact={compact} widgetConfig={widgetConfig} />
        </Suspense>
      )}

      {initialized && !restoring && isMap && (
        <Suspense fallback={<div>Loading...</div>}>
          {editor.widget && editor.layers && (
            <Map
              setMapParams={({ zoom, latLng, bounds }) => {
                console.log("map params update", zoom, latLng, bounds);
              }}
              layerId={configuration.layer}
              interactionEnabled={!standalone}
              widget={editor.widget}
              layers={editor.layers}
            />
          )}
        </Suspense>
      )}

      {!initialized && !missingWidget && (
        <RestoringWidget>
          <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
        </RestoringWidget>
      )}

      {restoring && !missingWidget && (
        <RestoringWidget>
          <RestoringWidgetTitle>Building widget...</RestoringWidgetTitle>
        </RestoringWidget>
      )}

      {!widgetConfig && !isMap && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChartColorFilter compact={compact} />
        </Suspense>
      )}
    </StyledContainer>
  );
};

export default Renderer;

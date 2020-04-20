import React, { Suspense } from "react";

import {
  StyledContainer,
  RestoringWidget,
  RestoringWidgetTitle,
} from "./style";

const Chart = React.lazy(() => import("../chart"));
const SelectChart = React.lazy(() => import("../select-chart"));
const ChartColorFilter = React.lazy(() => import("../chart-color-filter"));

// -- If a widget config is suplied, we are consuming the renderer outside of the editor
const Renderer = ({ widget, editor, widgetConfig = null }) => {
  const { restoring, initialized } = editor;
  const missingWidget = Object.keys(widget).length === 0 && !widgetConfig;

  return (
    <StyledContainer>

      {missingWidget && (
        <RestoringWidget>
          <RestoringWidgetTitle>No widget available</RestoringWidgetTitle>
        </RestoringWidget>  
      )}

      {!widgetConfig && !missingWidget && (
        <Suspense fallback={<div>Loading...</div>}>
          <SelectChart />
        </Suspense>
      )}

      {initialized && !restoring && !missingWidget && (
        <Suspense
          fallback={
            <RestoringWidget>
              <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
            </RestoringWidget>
          }
        >
          <Chart widgetConfig={widgetConfig} />
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

      {!widgetConfig && (
        <Suspense fallback={<div>Loading...</div>}>
          <ChartColorFilter />
        </Suspense>
      )}
    </StyledContainer>
  );
};

export default Renderer;

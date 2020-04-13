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
  return (
    <StyledContainer>
      {!widgetConfig && (
        <Suspense fallback={<div>Loading...</div>}>
          <SelectChart />
        </Suspense>
      )}

      {initialized && !restoring && (
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

      {!initialized && (
        <RestoringWidget>
          <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
        </RestoringWidget>
      )}

      {restoring && (
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

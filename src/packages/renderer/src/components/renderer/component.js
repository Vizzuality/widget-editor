import React, { Suspense } from "react";

import {
  StyledContainer,
  RestoringWidget,
  RestoringWidgetTitle,
} from "./style";

const Chart = React.lazy(() => import("../chart"));
const SelectChart = React.lazy(() => import("../select-chart"));
const ChartColorFilter = React.lazy(() => import("../chart-color-filter"));

const Renderer = ({ widget, editor }) => {
  const { restoring, initialized } = editor;
  return (
    <StyledContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <SelectChart />
      </Suspense>

      {initialized && !restoring && (
        <Suspense
          fallback={
            <RestoringWidget>
              <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
            </RestoringWidget>
          }
        >
          <Chart />
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

      <Suspense fallback={<div>Loading...</div>}>
        <ChartColorFilter />
      </Suspense>
    </StyledContainer>
  );
};

export default Renderer;

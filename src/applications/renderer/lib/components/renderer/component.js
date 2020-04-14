import React, { Suspense } from "react";
import { StyledContainer, RestoringWidget, RestoringWidgetTitle } from "./style";
const Chart = React.lazy(() => import("../chart"));
const SelectChart = React.lazy(() => import("../select-chart"));
const ChartColorFilter = React.lazy(() => import("../chart-color-filter")); // -- If a widget config is suplied, we are consuming the renderer outside of the editor

const Renderer = ({
  widget,
  editor,
  widgetConfig = null
}) => {
  const {
    restoring,
    initialized
  } = editor;
  return React.createElement(StyledContainer, null, !widgetConfig && React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(SelectChart, null)), initialized && !restoring && React.createElement(Suspense, {
    fallback: React.createElement(RestoringWidget, null, React.createElement(RestoringWidgetTitle, null, "Loading widget..."))
  }, React.createElement(Chart, {
    widgetConfig: widgetConfig
  })), !initialized && React.createElement(RestoringWidget, null, React.createElement(RestoringWidgetTitle, null, "Loading widget...")), restoring && React.createElement(RestoringWidget, null, React.createElement(RestoringWidgetTitle, null, "Building widget...")), !widgetConfig && React.createElement(Suspense, {
    fallback: React.createElement("div", null, "Loading...")
  }, React.createElement(ChartColorFilter, null)));
};

export default Renderer;
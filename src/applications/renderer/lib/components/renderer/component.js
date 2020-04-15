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
  return /*#__PURE__*/React.createElement(StyledContainer, null, !widgetConfig && /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null, "Loading...")
  }, /*#__PURE__*/React.createElement(SelectChart, null)), initialized && !restoring && /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement(RestoringWidget, null, /*#__PURE__*/React.createElement(RestoringWidgetTitle, null, "Loading widget..."))
  }, /*#__PURE__*/React.createElement(Chart, {
    widgetConfig: widgetConfig
  })), !initialized && /*#__PURE__*/React.createElement(RestoringWidget, null, /*#__PURE__*/React.createElement(RestoringWidgetTitle, null, "Loading widget...")), restoring && /*#__PURE__*/React.createElement(RestoringWidget, null, /*#__PURE__*/React.createElement(RestoringWidgetTitle, null, "Building widget...")), !widgetConfig && /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null, "Loading...")
  }, /*#__PURE__*/React.createElement(ChartColorFilter, null)));
};

export default Renderer;
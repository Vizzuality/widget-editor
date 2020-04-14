import React from "react";
import Chart from "../chart";
import ChartColorFilter from "../chart-color-filter";
import QueryValues from "../query-values";
import SelectChart from "../select-chart";
import { StyledContainer, RestoringWidget, RestoringWidgetTitle } from "./style";

const Renderer = ({
  widget,
  editor
}) => {
  const {
    restoring,
    initialized
  } = editor;
  return React.createElement(StyledContainer, null, React.createElement(SelectChart, null), initialized && !restoring && React.createElement(Chart, null), !initialized && React.createElement(RestoringWidget, null, React.createElement(RestoringWidgetTitle, null, "Loading widget...")), restoring && React.createElement(RestoringWidget, null, React.createElement(RestoringWidgetTitle, null, "Building widget...")), React.createElement(ChartColorFilter, null));
};

export default Renderer;
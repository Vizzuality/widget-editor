import React from "react";
import {
  TYPE_BAR,
  TYPE_STACKED_BAR,
  TYPE_BAR_HORIZONTAL,
  TYPE_STACKED_BAR_HORIZONTAL,
  TYPE_LINE,
  TYPE_SCATTERPLOT,
  TYPE_DONUT,
  TYPE_PIE,
  TYPE_MAP,
} from "../../const";
import { StyledBox, StyledIcon } from "./style";
import {
  Bar,
  StackedBar,
  BarHorizontal,
  StackedBarHorizontal,
  Donut,
  Pie,
  Line,
  Scatterplot,
  MapIcon,
} from "./svg";

const ChartIcon = ({
  type = TYPE_BAR,
  active = false,
  disabled = false,
  setData = (data) => {},
}) => {
  return (
    <StyledBox>
      <StyledIcon
        active={active}
        disabled={disabled}
        onClick={() => setData({ type })}
      >
        {type === TYPE_BAR && <Bar />}
        {type === TYPE_STACKED_BAR && <StackedBar />}

        {type === TYPE_BAR_HORIZONTAL && <BarHorizontal />}
        {type === TYPE_STACKED_BAR_HORIZONTAL && <StackedBarHorizontal />}

        {type === TYPE_PIE && <Pie />}
        {type === TYPE_DONUT && <Donut />}
        {type === TYPE_LINE && <Line />}
        {type === TYPE_SCATTERPLOT && <Scatterplot />}
        {type === TYPE_MAP && <MapIcon />}
      </StyledIcon>
    </StyledBox>
  );
};

export default ChartIcon;

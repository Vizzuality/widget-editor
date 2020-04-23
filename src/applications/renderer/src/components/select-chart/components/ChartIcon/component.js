import React from "react";
import {
  TYPE_COLUMN,
  TYPE_LINE,
  TYPE_SCATTERPLOT,
  TYPE_DONUT,
  TYPE_BAR,
  TYPE_BAR_VERTICAL,
  TYPE_PIE,
  TYPE_MAP,
} from "../../const";
import { StyledBox, StyledIcon } from "./style";
import {
  Line,
  Scatterplot,
  Donut,
  Pie,
  ColumnHorizontal,
  BarVertical,
  BarHorizontal,
  MapIcon,
} from "./svg";

const ChartIcon = ({
  type = TYPE_COLUMN,
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
        {type === TYPE_LINE && <Line />}
        {type === TYPE_SCATTERPLOT && <Scatterplot />}
        {type === TYPE_DONUT && <Donut />}
        {type === TYPE_PIE && <Pie />}
        {type === TYPE_MAP && <MapIcon />}

        {type === TYPE_BAR && <BarHorizontal />}
        {type === TYPE_BAR_VERTICAL && <BarVertical />}

        {type === TYPE_COLUMN && <ColumnHorizontal />}
      </StyledIcon>
    </StyledBox>
  );
};

export default ChartIcon;

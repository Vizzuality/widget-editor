import React from 'react';
import { TYPE_COLUMN, TYPE_LINE, DIRECTION_HORIZONTAL, TYPE_SCATTERPLOT, TYPE_RING, TYPE_BAR, TYPE_PIE } from "../../const";
import { StyledBox, StyledIcon } from "./style";
import { Line, Scatterplot, Ring, Pie, ColumnA, ColumnB, BarA, BarB } from "./svg";

const ChartIcon = ({
  type = TYPE_COLUMN,
  direction = DIRECTION_HORIZONTAL,
  active = false,
  disabled = false,
  setData = data => {
    console.log(data);
  }
}) => {
  return React.createElement(StyledBox, null, React.createElement(StyledIcon, {
    active: active,
    disabled: disabled,
    onClick: () => setData({
      type,
      direction
    })
  }, type === TYPE_LINE && React.createElement(Line, null), type === TYPE_SCATTERPLOT && React.createElement(Scatterplot, null), type === TYPE_RING && React.createElement(Ring, null), type === TYPE_PIE && React.createElement(Pie, null), type === TYPE_BAR && React.createElement(BarA, null), type === TYPE_COLUMN && React.createElement(ColumnA, null)));
};

export default ChartIcon;
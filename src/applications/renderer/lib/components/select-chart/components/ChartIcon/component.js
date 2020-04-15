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
  return /*#__PURE__*/React.createElement(StyledBox, null, /*#__PURE__*/React.createElement(StyledIcon, {
    active: active,
    disabled: disabled,
    onClick: () => setData({
      type,
      direction
    })
  }, type === TYPE_LINE && /*#__PURE__*/React.createElement(Line, null), type === TYPE_SCATTERPLOT && /*#__PURE__*/React.createElement(Scatterplot, null), type === TYPE_RING && /*#__PURE__*/React.createElement(Ring, null), type === TYPE_PIE && /*#__PURE__*/React.createElement(Pie, null), type === TYPE_BAR && /*#__PURE__*/React.createElement(BarA, null), type === TYPE_COLUMN && /*#__PURE__*/React.createElement(ColumnA, null)));
};

export default ChartIcon;
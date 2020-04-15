import React from "react";
import { Select } from "@packages/shared";
import isObjectLike from "lodash/isObjectLike";
import { StyledContainer, StyledColorsBoxContainer, StyledColorsBox, StyledColorDot, StyledDropdownBox } from "./style";
let c = 0;

const resolveSchemeColor = (scheme, index) => {
  if (index % scheme.length === 0) {
    c = 0;
  }

  const color = scheme[c];
  c++;
  return color;
};

const ChartColorFilter = ({
  color,
  configuration,
  schemeColor,
  selectedColor,
  activeScheme,
  columns,
  widgetData,
  setFilters,
  patchConfiguration
}) => {
  const isPie = configuration.chartType === "pie";
  const isSingleColorSelection = !isPie && !isObjectLike(color);

  const handleChange = option => {
    const color = option.identifier === "___single_color" ? null : option;

    if (isPie) {
      patchConfiguration({
        category: color
      });
    } else {
      setFilters({
        color
      });
      patchConfiguration({
        color
      });
    }
  };

  return /*#__PURE__*/React.createElement(StyledContainer, null, isSingleColorSelection && /*#__PURE__*/React.createElement(StyledColorsBoxContainer, {
    overflowIsHidden: false,
    alignCenter: !isObjectLike(color)
  }, /*#__PURE__*/React.createElement(StyledColorsBox, {
    alignCenter: false
  }, /*#__PURE__*/React.createElement(StyledColorDot, {
    color: schemeColor
  }), "Single color")), !isSingleColorSelection && /*#__PURE__*/React.createElement(StyledColorsBoxContainer, {
    overflowIsHidden: true
  }, widgetData && widgetData.map((node, index) => {
    return /*#__PURE__*/React.createElement(StyledColorsBox, {
      alignCenter: true,
      key: `${node.x}-${index}`
    }, /*#__PURE__*/React.createElement(StyledColorDot, {
      color: resolveSchemeColor(activeScheme.category, index)
    }), node.x);
  })), /*#__PURE__*/React.createElement(StyledDropdownBox, null, /*#__PURE__*/React.createElement(Select, {
    align: "horizontal",
    relative: true,
    menuPlacement: "top",
    value: selectedColor,
    onChange: handleChange,
    getOptionLabel: option => option.name || option.alias || option.identifier,
    getOptionValue: option => option.identifier,
    options: columns,
    configuration: configuration,
    isCustom: true,
    isPopup: true
  })));
};

export default ChartColorFilter;
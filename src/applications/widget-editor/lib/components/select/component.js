function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { Fragment } from "react";
import Select from "react-select";
import Popup from "./components/Popup";
import { ALIGN_HORIZONTAL } from "./const";
import { StyledSelectBox, CustomStyles, InputStyles } from "./style";
/**
 * CustomSelect. Component uses react-select library for customization.
 */

const CustomSelect = ({
  isCustom = false,
  isPopup = false,
  relative = false,
  configuration = {},
  align = ALIGN_HORIZONTAL,
  onChange = () => {},
  ...otherProps
}) => {
  const handleChange = option => {
    onChange(option);
  };

  return React.createElement(Fragment, null, React.createElement(StyledSelectBox, {
    align: align,
    relative: relative
  }, React.createElement(Select, _extends({
    align: align,
    onChange: handleChange,
    styles: isCustom ? CustomStyles : InputStyles,
    components: isCustom ? {
      Menu: Popup
    } : null
  }, otherProps))));
};

export default CustomSelect;
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { Fragment } from "react";
import CategoryIcon from "../../../icons/CategoryIcon";
import { ALIGN_HORIZONTAL } from "../../const";
import { StyledPopupContainer, StyledPopupInsideContainer, StyledCategoryInfoContainer, StyledCategoryAlias, StyledValueAlias, StyledDescription, IconBox } from "./style";

const Popup = ({
  options,
  getValue,
  setValue,
  innerRef,
  innerProps,
  selectProps
}) => {
  const selected = getValue()[0];
  const {
    align = ALIGN_HORIZONTAL
  } = selectProps;
  return React.createElement(StyledPopupContainer, _extends({
    align: align,
    ref: innerRef
  }, innerProps), React.createElement(StyledPopupInsideContainer, {
    align: align
  }, options.map(op => React.createElement(Fragment, {
    key: op.identifier + op.name
  }, React.createElement(StyledCategoryAlias, {
    nonSelectedCategory: op.identifier === "___single_color",
    active: selected && op.identifier === selected.identifier,
    onClick: () => setValue(op)
  }, React.createElement(IconBox, null, React.createElement(CategoryIcon, null)), op.identifier === "___single_color" ? "Single color" : op.identifier), op.identifier !== "___single_color" && React.createElement(StyledCategoryInfoContainer, null, React.createElement(StyledValueAlias, null, React.createElement(IconBox, null, "#"), op.alias || op.name || op.identifier), op.description && React.createElement(StyledDescription, null, op.description))))));
};

export default Popup;
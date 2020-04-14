import React from "react";
import { StyledCheckbox } from "./style";

const NotNullInput = ({
  filter,
  name = "untitled_checkbox",
  label = "",
  setData
}) => {
  if (!filter) {
    return null;
  }

  return React.createElement(StyledCheckbox, null, React.createElement("input", {
    type: "checkbox",
    id: name,
    checked: filter.filter.notNull,
    onChange: e => setData(e.target.value, filter.id, "NOT_NULL_CHECK")
  }), React.createElement("label", {
    htmlFor: name
  }, label));
};

export default NotNullInput;
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
  return (
    <StyledCheckbox>
      <input
        type="checkbox"
        id={name}
        checked={filter.filter.notNull}
        onChange={e => setData(e.target.value, filter.id, "NOT_NULL_CHECK")}
      />
      <label for={name}>{label}</label>
    </StyledCheckbox>
  );
};

export default NotNullInput;

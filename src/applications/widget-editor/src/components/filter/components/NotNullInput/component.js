import React from "react";

import { StyledCheckbox } from "./style";

const NotNullInput = ({ filter, onChange }) => (
  <StyledCheckbox>
    <input
      type="checkbox"
      id={`filter-no-null-${filter.id}`}
      checked={filter.notNull}
      onChange={e => onChange(e.target.checked)}
    />
    <label htmlFor={`filter-no-null-${filter.id}`}>
      Remove "null" values
    </label>
  </StyledCheckbox>
);

export default NotNullInput;

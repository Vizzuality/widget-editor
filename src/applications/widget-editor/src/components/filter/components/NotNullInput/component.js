import React from "react";

import Checkbox from "styles-common/checkbox";

const NotNullInput = ({ filter, onChange }) => (
  <Checkbox
    id={`filter-no-null-${filter.id}`}
    label={`Remove "null" values`}
    checked={filter.notNull}
    onChange={onChange}
  />
);

export default NotNullInput;

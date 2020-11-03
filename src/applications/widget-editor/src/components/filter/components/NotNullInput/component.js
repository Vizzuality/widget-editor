import React from "react";
import PropTypes from 'prop-types';

import Checkbox from "styles-common/checkbox";

const NotNullInput = ({ filter, onChange }) => (
  <Checkbox
    id={`filter-no-null-${filter.id}`}
    label={`Remove "null" values`}
    checked={filter.notNull}
    onChange={onChange}
  />
);

NotNullInput.propTypes = {
  onChange: PropTypes.func,
  filter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    notNull: PropTypes.bool
  })
}

export default NotNullInput;

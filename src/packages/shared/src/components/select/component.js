import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";

import { select as SelectTypes } from '@widget-editor/types/js-types';

import SelectStyles, { StyledDropdownIndicator, StyledCloseIndicator } from "./style";

const Select = ({
  id,
  loading = false,
  options,
  value,
  styles,
  onChange,
  disabled,
  'aria-label': ariaLabel,
  components,
  creatable,
  ...rest
}) => {
  const Component = creatable ? ReactSelectCreatable : ReactSelect;
  const [isDisabled, setIsDisabled] = useState(disabled || loading);

  return (
    <Component
      inputId={id}
      aria-label={ariaLabel}
      options={options}
      value={value}
      onChange={value => {
        setIsDisabled(true);
        onChange(value);
      }}
      isDisabled={isDisabled}
      styles={styles || SelectStyles}
      captureMenuScroll={false}
      components={{
        DropdownIndicator: () => <StyledDropdownIndicator />,
        ClearIndicator: props => <StyledCloseIndicator {...props} />,
        ...(components ?? {}),
      }}
      {...rest}
    />
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  options: SelectTypes.options,
  value: SelectTypes.value,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
  creatable: PropTypes.bool,
};

Select.defaultProps = {
  value: undefined,
  onChange: () => null,
  styles: null,
  disabled: false,
  'aria-label': null,
  creatable: false,
};

export default Select;

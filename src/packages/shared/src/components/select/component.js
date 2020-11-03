/* eslint react/display-name: 0 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";

import { JSTypes } from "@widget-editor/types";

import SelectStyles, { StyledDropdownIndicator, StyledCloseIndicator } from "./style";

const Select = ({
  id,
  loading,
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

  useEffect(() => {
    setIsDisabled(disabled || loading);
  }, [disabled, loading, setIsDisabled]);

  return (
    <Component
      inputId={id}
      aria-label={ariaLabel}
      options={options}
      value={value}
      onChange={onChange}
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
  options: JSTypes.select.options,
  value: JSTypes.select.value,
  onChange: PropTypes.func,
  styles: PropTypes.object,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string,
  creatable: PropTypes.bool,
  loading: PropTypes.bool,
  components: PropTypes.any
};

Select.defaultProps = {
  value: undefined,
  loading: false,
  onChange: () => null,
  styles: null,
  disabled: false,
  'aria-label': null,
  creatable: false,
};

export default Select;

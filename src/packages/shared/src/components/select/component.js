import React from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";

import SelectStyles, { StyledDropdownIndicator, StyledCloseIndicator } from "./style";

const Select = ({
  id,
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

  return (
    <Component
      inputId={id}
      aria-label={ariaLabel}
      options={options}
      value={value}
      onChange={onChange}
      isDisabled={disabled}
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          isDisabled: PropTypes.bool,
        })
      ),
      isDisabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
    })),
  ]),
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

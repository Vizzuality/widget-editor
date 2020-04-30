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
  compact = false,
  onChange = () => {},
  ...otherProps
}) => {
  const handleChange = (option) => {
    onChange(option);
  };
  return (
    <Fragment>
      <StyledSelectBox compact={compact} align={align} relative={relative}>
        <Select
          align={align}
          onChange={handleChange}
          styles={isCustom ? CustomStyles : InputStyles}
          components={isCustom ? { Menu: Popup } : null}
          {...otherProps}
        />
      </StyledSelectBox>
    </Fragment>
  );
};

export default CustomSelect;

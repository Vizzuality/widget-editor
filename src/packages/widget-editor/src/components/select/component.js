import React, { useState, useRef, useEffect, Fragment } from "react";
import Select from "react-select";
import Popup from "./components/Popup";
import { ALIGN_HORIZONTAL } from './const';
import {
  StyledSelectBox,
  StyledOverflow,
  CustomStyles,
  InputStyles,
} from "./style";

/**
 * CustomSelect. Component uses react-select library for customization.
 */
const CustomSelect = ( { 
  isCustom = false, 
  isPopup = false, 
  configuration = {}, 
  align = ALIGN_HORIZONTAL,
  onChange = () => {},
  ...otherProps 
} ) => {

  const handleChange = option => {
    onChange(option);
  }

  return (
    <Fragment>
      <StyledSelectBox
        align={align}
      >
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
}

export default CustomSelect;
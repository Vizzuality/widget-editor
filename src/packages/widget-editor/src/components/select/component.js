import React, { useState } from "react";
import Select from "react-select";
import Popup from "./components/Popup";
import CustomOption from './components/CustomOption'
import {
  StyledSelectBox,
  CustomStyles,
  InputStyles
} from "./style";

/**
 * CustomSelect. Component uses react-select library for customization.
 */
const CustomSelect = ( props ) => {

  const { isCustom, isPopup, configuration, ...otherProps } = props;
  const { value, category } = configuration;
  const [isPopupOpen, setPopup] = useState(false);
  const [isOpen, setOpen] = useState(false);

  return (
    <StyledSelectBox
      onMouseEnter={() => setPopup(true)} 
      onMouseLeave={() => setPopup(false)}
    >
      <Select
        {...otherProps}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        styles={isCustom ? CustomStyles : InputStyles} 
        components={isCustom ? { Option: CustomOption } : null}
      />
      {isPopup && isPopupOpen && !isOpen && (
        <Popup category={category} value={value} />
      )}
    </StyledSelectBox>
  );
}

export default CustomSelect;
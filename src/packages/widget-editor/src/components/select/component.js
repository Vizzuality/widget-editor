import React, { useState } from "react";
import Select from "react-select";
import Popup from "./components/Popup";
import CustomOption from './components/CustomOption'
import {
  StyledSelectBox,
  CustomStyles,
  CustomStylesVertical,
  InputStyles
} from "./style";

/**
 * CustomSelect. Component uses react-select library for customization.
 */
const CustomSelect = ( { 
  isCustom = false, 
  isPopup = false, 
  configuration = {}, 
  align = 'horizontal', 
  ...otherProps 
} ) => {

  const { value, category } = configuration;
  const [isPopupOpen, setPopup] = useState(false);
  const [isOpen, setOpen] = useState(false);

  return (
    <StyledSelectBox
      onMouseEnter={() => setPopup(true)} 
      onMouseLeave={() => setPopup(false)}
      align={align}
    >
      <Select
        {...otherProps}
        align={align}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        styles={isCustom ? CustomStyles : InputStyles} 
        components={isCustom ? { Option: CustomOption } : null}
      />
      {isPopup && isPopupOpen && !isOpen && (
        <Popup category={category} value={value} align={align} />
      )}
    </StyledSelectBox>
  );
}

export default CustomSelect;
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

  const { isCustom, isPopup, onChange, defaultValue } = props;
  const [isPopupOpen, setPopup] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const changeValue = selectedOption => {
    onChange(selectedOption);
    setSelected(selectedOption);
  }

  return (
    <StyledSelectBox
      onMouseEnter={() => setPopup(true)} 
      onMouseLeave={() => setPopup(false)}
    >
      <Select
        {...props}
        onChange={changeValue}
        onMenuOpen={() => setOpen(true)}
        onMenuClose={() => setOpen(false)}
        styles={isCustom ? CustomStyles : InputStyles} 
        components={isCustom ? { Option: CustomOption } : null}
      />
      {isPopup && isPopupOpen && !isOpen && (
        <Popup data={selected} />
      )}
    </StyledSelectBox>
  );
}

export default CustomSelect;
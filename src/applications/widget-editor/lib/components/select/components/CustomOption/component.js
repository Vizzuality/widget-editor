import React from "react";
import { StyledSelectOption, StyledSelectOptionTitle, StyledSelectOptionDescription } from "./style";

const CustomOption = ({
  data,
  isDisabled,
  innerProps
}) => {
  const {
    description,
    alias
  } = data;
  return !isDisabled ? React.createElement(StyledSelectOption, innerProps, React.createElement(StyledSelectOptionTitle, null, alias), description && description.length > 0 && React.createElement(StyledSelectOptionDescription, null, description)) : null;
};

export default CustomOption;
import React from "react";
import { 
  StyledSelectOption,
  StyledSelectOptionTitle,
  StyledSelectOptionDescription
} from './style';

const CustomOption = ({ data, isDisabled, innerProps }) => {
  const { description, alias } = data;
  return ( !isDisabled ? (
    <StyledSelectOption {...innerProps}>
      <StyledSelectOptionTitle>
        { alias }
      </StyledSelectOptionTitle>
      {description && description.length > 0 && (
        <StyledSelectOptionDescription>
          { description }
        </StyledSelectOptionDescription>
      )}
    </StyledSelectOption>
  ) : null);
};

export default CustomOption;
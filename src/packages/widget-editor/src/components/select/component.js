import React from "react";
import styled from "styled-components";
import Select from "react-select";

const StyledSelectOptionTitle = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  font-weight: 500;  
`;

const StyledSelectOptionDescription = styled.div`
  font-size: 12px;
  padding-top: 10px;  
`;

const StyledSelectOption = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid #6f6f6f;
  color: ${props => (props.isDisabled ? "#eaeaea" : "#6f6f6f" || "#6f6f6f")};
  &:hover {
    background-color: blue;
    cursor: pointer;
    color: white;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  })
};

const CustomStyles = {

  container: () => ({
    position: "relative",
    "box-sizing": "border-box",
  }),
  
  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided, state) => {
    // console.log(state);
    return ({
      color: "#c32d7b",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "none",
      transition: "all 0.2s ease-out",    
    });
  },

  indicatorsContainer: () => ({
    color: "#c32d7b",
    display: "flex",
    padding: "8px",
    transition: "color 150ms",
    "box-sizing": "border-box",
    position: "relative",
    top: "5px",
  }),

  control: () => ({
    display: "flex",
    border: "none",
    borderRadius: "4px",
    padding: "3px 0"
  })
}

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

/**
 * CustomSelect. Component uses react-select library for customization.
 */
const CustomSelect = ({ isCustom, ...props }) => {
  return (
    <Select
      {...props} 
      styles={isCustom ? CustomStyles : InputStyles} 
      components={isCustom ? { Option: CustomOption } : null}
    />
  );
}

export default CustomSelect;
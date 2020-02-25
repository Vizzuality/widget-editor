import styled from "styled-components";

export const StyledSelectBox = styled.div`
  position: relative;
`;

export const InputStyles = {
  control: () => ({
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  })
};

export const CustomStyles = {

  container: () => ({
    position: "relative",
    boxSizing: "border-box",
    cursor: "pointer",
  }),
  
  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided, state) => {
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
    boxSizing: "border-box",
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

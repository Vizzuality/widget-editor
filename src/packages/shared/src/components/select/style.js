import styled, { css } from "styled-components";

export const StyledSelectBox = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  ${(props) =>
    !props.relative &&
    css`
      position: absolute;
      bottom: 10px;
      left: calc(50% - 150px);
    `}

  ${(props) =>
    props.align === "vertical" &&
    css`
      bottom: 0;
      left: -10px;
      max-width: 60px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    `}
`;

export const StyledOverflow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

export const InputStyles = {
  control: () => ({
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    background: "#FFF",
    borderRadius: "4px",
    padding: "3px 0",
  }),
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
    const { menuIsOpen, align } = state.selectProps;
    return {
      color: "#c32d7b",
      transform:
        menuIsOpen && align === "horizontal" ? "rotate(180deg)" : "none",
      transition: "all 0.2s ease-out",
    };
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

  control: (provided, state) => {
    const { align } = state.selectProps;
    const wordPixel = 10;
    const additionalProps =
      align === "vertical"
        ? {
            transform: "rotate(-90deg)",
          }
        : null;
    return {
      margin: "0 auto",
      display: "flex",
      border: "none",
      minWidth: "90px",
      borderRadius: "4px",
      maxWidth: "210px",
      padding: "3px 0",
      minWidth: "180px",
      ...additionalProps,
    };
  },

  menu: (provided, state) => {
    const { align } = state.selectProps;
    const additionalProps =
      align === "vertical"
        ? {
            position: "absolute",
            left: "100px",
            top: "-50px",
            bottom: "auto",
            width: "300px",
          }
        : null;
    return {
      ...provided,
      ...additionalProps,
    };
  },
};

import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  margin: 10px;
  ${(props) =>
    (props.isCompact || props.forceCompact) &&
    css`
      display: flex;
      align-items: center;
    `}
`;

export const StyledSelectBox = styled.div`
  ${(props) =>
    (props.isCompact || props.forceCompact) &&
    css`
      width: 100%;
      padding-right: 15px;
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
  container: () => ({
    position: "relative",
    boxSizing: "border-box",
    cursor: "pointer",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    backgroundColor: "rgba(255,255,255,1)",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided, state) => {
    return {
      color: "#c32d7b",
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

  control: () => ({
    display: "flex",
    border: "none",
    borderRadius: "4px",
    padding: "3px 0",
  }),
};

import styled, { css } from "styled-components";

import { SelectStyles as DefaultSelectStyles } from "@widget-editor/shared";

export const StyledDropdownBox = styled.div`
  flex-basis: 40%;
  flex-shrink: 0;
  margin-left: 20px;
`;

export const StyledColorsBoxContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  max-height: 120px;
  overflow-y: scroll;

  ${(props) => props.alignCenter && css`
    align-items: center;
  `}
`;

export const StyledColorsBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #717171;

  ${(props) => props.alignCenter && css`
    display: block;
    position: relative;
    flex-basis: calc(50% - (10px / 2));
    margin: 5px 10px 5px 0;
    padding-left: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:nth-of-type(2n + 2) {
      margin-right: 0;
    }

    > span {
      position: absolute;
      top: 1px;
      left: 0;
    }
  `}
`;

export const StyledColorDot = styled.span`
  ${(props) =>
    props.color &&
    css`
      background: ${props.color};
    `}

  width: 14px;
  height: 14px;
  display: block;
  border-radius: 14px;
  margin: 0 5px 0 0;
`;

export const StyledContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  border-top: 1px solid #d7d7d7;
`;

export const SelectStyles = {
  ...DefaultSelectStyles,
  container: (_, state) => {
    const defaultStyles = DefaultSelectStyles.container?.(_, state) ?? {};
    
    if (state.isFocused) {
      return defaultStyles;
    }

    return {
      ...defaultStyles,
      border: "1px solid transparent",
    };
  },
  menu: (_, state) => {
    const defaultStyles = DefaultSelectStyles.menu?.(_, state) ?? {};

    return {
      ...defaultStyles,
      position: "absolute",
      right: "0",
      bottom: "100%",
      width: "100%",
      minWidth: "300px",
      marginTop: "8px",
      marginBottom: "8px",
      padding: "4px 0px",
      backgroundColor: "white",
      border: "1px solid #D7D7D7",
      borderRadius: "4px",
      boxShadow: "0 20px 30px 0 rgba(0,0,0,0.1)",
      transform: state.selectProps.position === "left" ? "rotate(90deg) translateX(100%)" : "null",
      transformOrigin: state.selectProps.position === "left" ? "top right" : "null",
      zIndex: 1,
      ':before': {
        content: "''",
        position: "absolute",
        bottom: "-10px",
        right: "-5px",
        border: "10px solid transparent",
        borderTopColor: "#D7D7D7",
        zIndex: "-1",
        transform: "translate(-50%, 50%)",
      },
      ':after': {
        content: "''",
        position: "absolute",
        bottom: "-9px",
        right: "-5px",
        border: "10px solid transparent",
        borderTopColor: "#FFFFFF",
        transform: "translate(-50%, 50%)",
      },
    };
  },
};

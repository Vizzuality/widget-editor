import styled, { css } from "styled-components";

import { SelectStyles as DefaultSelectStyles } from "@widget-editor/shared";

export const StyledDropdownBox = styled.div`
  flex-basis: 30%;
  flex-shrink: 0;
  margin-left: 20px;
`;

export const StyledColorsBoxContainer = styled.div`
  flex-grow: 1;

  ${(props) =>
    props.alignCenter &&
    css`
      align-items: center;
      display: flex;
    `}

  ${(props) =>
    props.overflowIsHidden &&
    css`
      max-height: 70px;
      overflow-y: scroll;
    `}
`;

export const StyledColorsBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #717171;
  ${(props) =>
    props.alignCenter &&
    css`
      float: left;
      width: 110px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 5px;
      padding-left: 20px;
      position: relative;
      > span {
        position: absolute;
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
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #d7d7d7;
  width: 100%;
  min-height: 55px;
  padding: 15px 36px;
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
      bottom: "100%",
      width: "100%",
      marginTop: "8px",
      marginBottom: "8px",
      backgroundColor: "white",
      borderRadius: "4px",
      boxShadow: "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1)",
      transform: state.selectProps.position === "left" ? "rotate(90deg) translateX(100%)" : "null",
      transformOrigin: state.selectProps.position === "left" ? "top right" : "null",
      zIndex: "1",
    };
  },
};

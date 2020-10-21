import styled from "styled-components";

import { SelectStyles as DefaultSelectStyles } from "@widget-editor/shared";

const SELECT_WIDTH = 250;

export const StyledBottomSelect = styled.div`
  position: absolute;
  bottom: 5px;
  left: ${props => props.hasYAxis ? 'calc((100% - 60px - 20px) / 2 + 60px)' : '50%'};
  transform: translateX(-50%);
  width: ${SELECT_WIDTH}px;
`;

export const StyledLeftSelect = styled.div`
  position: absolute;
  bottom: calc((100% - 55px - 15px) / 2 + 55px);
  left: 10px;
  transform: translateY(50%) rotate(-90deg) translateY(calc(-${SELECT_WIDTH / 2}px + (45px / 2)));
  transform-origin: center;
  width: 250px;
  z-index: 1;
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
      top: state.selectProps.position === "left" ? "100%" : "auto",
      bottom: state.selectProps.position === "bottom" ? "100%" : "auto",
      right: "0",
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
        bottom: state.selectProps.position === "bottom" ? "-11px" : "auto",
        left: state.selectProps.position === "left" ? "-11px" : "auto",
        right:  state.selectProps.position === "bottom" ? "-5px" : "auto",
        top:  state.selectProps.position === "left" ? "-5px" : "auto",
        border: "10px solid transparent",
        borderTopColor: "#D7D7D7",
        zIndex: "-1",
        transform: state.selectProps.position === "bottom"
          ? "translate(-50%, 50%)"
          : "translate(-50%, 50%) rotate(90deg)",
      },
      ':after': {
        content: "''",
        position: "absolute",
        bottom: state.selectProps.position === "bottom" ? "-10px" : "auto",
        left: state.selectProps.position === "left" ? "-10px" : "auto",
        right: state.selectProps.position === "bottom" ? "-5px" : "auto",
        top: state.selectProps.position === "left" ? "-5px" : "auto",
        border: "10px solid transparent",
        borderTopColor: "#FFFFFF",
        transform: state.selectProps.position === "bottom"
          ? "translate(-50%, 50%)"
          : "translate(-50%, 50%) rotate(90deg)",
      },
    };
  },
};

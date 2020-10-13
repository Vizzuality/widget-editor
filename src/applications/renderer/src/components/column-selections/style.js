import styled from "styled-components";

import { SelectStyles as DefaultSelectStyles } from "@widget-editor/shared";

const SELECT_WIDTH = 250;

export const StyledBottomSelect = styled.div`
  position: absolute;
  bottom: 10px;
  left: ${props => props.hasYAxis ? 'calc((100% - 65px - 20px) / 2 + 65px)' : '50%'};
  // left: ${props => props.hasYAxis ? 'calc((100% + 65px) / 2)' : '50%'};
  transform: translateX(-50%);
  width: ${SELECT_WIDTH}px;
`;

export const StyledLeftSelect = styled.div`
  position: absolute;
  bottom: calc((100% - 65px - 15px) / 2 + 65px);
  left: 10px;
  transform: translateY(50%) rotate(-90deg) translateY(calc(-${SELECT_WIDTH / 2}px + (45px / 2)));
  transform-origin: center;
  width: 250px;
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

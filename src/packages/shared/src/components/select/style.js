import React from 'react';
import styled, { css } from "styled-components";

import { AccordionArrowIcon, CloseIcon } from "components/icons";

export const StyledDropdownIndicator = styled(props => <AccordionArrowIcon {...props} />)`
  width: 32px;
  height: 32px;
  padding: 8px;
  stroke: #c32d7b;
`;

export const StyledCloseIndicator = styled(({ innerProps, className }) => {
  const Icon = styled(CloseIcon)`
    display: block;
  `;

  return (
    <div {...innerProps} className={className}>
      <Icon width="10" height="10" />
    </div>
  );
})`
  padding: 8px;
`;

export const StyledColumnOption = styled(({ overflow, ...rest }) => <div {...rest} />)`
  ${
    props => !props.overflow
      ? css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      `
      : ''
  }

  svg {
    margin-right: 5px;

    path {
      fill: currentColor;
    }
  }
`;

export const StyledColumnOptionDescription = styled.div`
  margin-top: 5px;
  font-size: 14px;
  font-style: italic;
  white-space: initial;
  color: #717171;
`;

export default {
  container: (_, state) => {
    let borderColor = "rgba(202,204,208,0.85)";
    if (state.isDisabled) {
      borderColor = "rgba(202,204,208,0.34)";
    } else if (state.isFocused) {
      borderColor = "#c32d7b";
    }

    return {
      position: "relative",
      boxSizing: "border-box",
      cursor: "pointer",
      border: `1px solid ${borderColor}`,
      borderRadius: "4px",
      backgroundColor: "rgba(255,255,255,1)",
      pointerEvents: state.isDisabled ? 'none' : null,
    }
  },

  singleValue: (provided, state) => {
    const maxWidth = 'calc(100% - 90px)';
    return { ...provided, maxWidth };
  },

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
    position: "relative",
    top: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#c32d7b",
  }),

  control: () => ({
    display: "flex",
    minHeight: "43px",
    border: "none",
    borderRadius: "4px",
  }),

  option: (provided, state) => {
    let backgroundColor = "white";
    if (state.isFocused) {
      backgroundColor = "rgba(44, 117, 176, 0.1)";
    }

    const color = state.isSelected ? "#2C75B0" : "#393f44";

    return {
      ...provided,
      color,
      backgroundColor,
      opacity: state.isDisabled ? 0.4 : 1,
    };
  },

  multiValue: provided => ({
    ...provided,
    backgroundColor: "rgba(44, 117, 176, 0.1)",
  }),

  placeholder: provided => ({
    ...provided,
    color: "#c5c7c8",
    fontFamily: "'Lato', 'Helvetica Neue', Helvetica, Arial, sans",
  }),
};
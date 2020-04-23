import React from "react";
import styled, { css } from "styled-components";

const StyledButton = styled.button`
  cursor: pointer;
  font-size: 16px;
  color: #393f44;
  border: 1px solid rgba(202, 204, 208, 0.85);
  background: transparent;
  padding: 10px 20px;
  border-radius: 5px;
  outline: 1;

  ${(props) =>
    props.size &&
    props.size === "small" &&
    css`
      padding: 7px 15px;
    `}

  ${(props) =>
    props.type &&
    props.type === "cta" &&
    css`
      background: ${props.color};
      color: #fff;
      border: 1px solid transparent;
    `}

  ${(props) =>
    props.type &&
    props.type === "highlight" &&
    css`
      color: ${props.color};
      border: 1px solid ${props.color};
    `}

  ${(props) =>
    props.type &&
    props.type === "default" &&
    css`
      &:hover,
      &.active {
        ${(props) =>
          props.color &&
          css`
            border: 1px solid ${props.color};
            color: ${props.color};
          `}
      }
    `}

  ${(props) =>
    props.active &&
    css`
      border: 1px solid ${props.color};
      color: ${props.color};
    `}
`;

const Button = ({ type = "button", theme, children, ...props }) => {
  return (
    <StyledButton {...props} color={theme.color} type={type}>
      {children}
    </StyledButton>
  );
};

export default Button;

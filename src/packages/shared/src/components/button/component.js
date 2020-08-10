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

  &[disabled] {
    pointer: default;
    opacity: 0.5;
  }

  &[aria-pressed = "true"]:not([disabled]) {
    border: 1px solid ${props => props.color};
    color: ${props => props.color};
  }

  ${(props) =>
    props.size &&
    props.size === "small" &&
    css`
      padding: 7px 15px;
    `}

  ${(props) =>
    props.btnType &&
    props.btnType === "cta" &&
    css`
      background: ${props.color};
      color: #fff;
      border: 1px solid transparent;
    `}

  ${(props) =>
    props.btnType &&
    props.btnType === "highlight" &&
    css`
      color: ${props.color};
      border: 1px solid ${props.color};
    `}

  ${(props) =>
    props.btnType &&
    props.btnType === "default" &&
    css`
      &:hover:not([disabled]) {
        ${(props) =>
          props.color &&
          css`
            border: 1px solid ${props.color};
            color: ${props.color};
          `}
      }
    `}
`;

const Button = ({ type, btnType = "default", theme, children, active, ...props }) => {
  return (
    <StyledButton
      {...props}
      color={theme.color}
      type="button"
      role="button"
      btnType={btnType}
      {...(typeof active === 'boolean'
        ? { 'aria-pressed': active }
        : {}
      )}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

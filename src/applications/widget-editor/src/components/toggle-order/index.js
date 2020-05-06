import React, { Fragment } from "react";
import styled, { css } from "styled-components";

import { ArrowIcon } from "@widget-editor/shared";

const StyledButton = styled.button`
  border: 1px solid rgba(202, 204, 208, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 0;
  cursor: pointer;
  border-radius: 5px;
  outline: none;

  &:focus {
    border: 1px solid #c32d7b;
  }

  &:hover {
    color: #c32d7b;
    svg {
      transition: all 0.4s;
      fill: #c32d7b;
    }
  }

  ${(props) =>
    props.order &&
    props.order === "asc" &&
    css`
      svg {
        transition: all 0.4s;
        transform: rotate(180deg);
      }
    `}

  svg {
    width: 14px;
    height: 14px;
    fill: #c32d7b;
  }
`;

const ToggleOrder = ({ order, options, onChange }) => {
  const handleChange = () => {
    const findOposite = options.filter((o) => o.value !== order.value)[0];
    onChange(findOposite);
  };
  return (
    <StyledButton order={order.value} type="button" onClick={handleChange}>
      <ArrowIcon />
    </StyledButton>
  );
};

export default ToggleOrder;

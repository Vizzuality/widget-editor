import React, { Fragment } from "react";
import styled, { css } from "styled-components";

import { ArrowIcon } from "@widget-editor/shared";

const StyledButton = styled.button`
  border: none;
  color: #393f44;
  background: transparent;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 0;
  border-radius: 5px;
  outline: none;
  cursor: pointer;

  &:hover {
    color: #c32d7b;
    svg {
      fill: #c32d7b;
    }
  }

  ${(props) =>
    props.order &&
    props.order === "asc" &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}

  svg {
    margin-left: 10px;
    width: 16px;
    height: 16px;
    fill: #393f44;
  }
`;

const ToggleOrder = ({ order, options, onChange }) => {
  const handleChange = () => {
    const findOposite = options.filter((o) => o.value !== order.value)[0];
    onChange(findOposite);
  };
  return (
    <StyledButton order={order.value} type="button" onClick={handleChange}>
      {order.value === "asc" && (
        <Fragment>
          Asc <ArrowIcon />
        </Fragment>
      )}
      {order.value === "desc" && (
        <Fragment>
          Desc <ArrowIcon />
        </Fragment>
      )}
    </StyledButton>
  );
};

export default ToggleOrder;

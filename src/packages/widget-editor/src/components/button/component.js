import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  font-size: 16px;
  color: #393f44;
  border: 1px solid rgba(202, 204, 208, 0.85);
  background: transparent;
  padding: 10px 20px;
  border-radius: 5px;
`;

const Button = ({ children }) => {
  return <StyledButton>{children}</StyledButton>;
};

export default Button;

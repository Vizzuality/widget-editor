import React from "react";
import styled, { css } from "styled-components";

import { Button } from "@widget-editor/shared";

const StyledFooter = styled.footer`
  width: 100%;
  margin-top: 20px;

  ${(props) => props.disabled && css`
    display: none;
  `}
`;

const Footer = ({ enableSave, onSave }) => {
  return (
    <StyledFooter disabled={!enableSave}>
      {enableSave && (
        <Button type="button" btnType="cta" onClick={onSave}>
          Save widget
        </Button>
      )}
    </StyledFooter>
  );
};

export default Footer;

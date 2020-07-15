import React, { useState, Fragment } from "react";
import styled, { css } from "styled-components";

import { Button } from "@widget-editor/shared";

import { FOOTER_HEIGHT } from "@widget-editor/shared/lib/styles/style-constants";

const StyledFooter = styled.footer`
  ${(props) =>
    props.disabled &&
    css`
      display: none;
    `}
  width: 100%;
  height: ${FOOTER_HEIGHT};
  align-self: flex-end;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = ({ enableSave, onSave }) => {
  return (
    <StyledFooter disabled={!enableSave}>
      {enableSave && (
        <Button role="button" type="button" btnType="cta" onClick={onSave}>
          Save widget
        </Button>
      )}
    </StyledFooter>
  );
};

export default Footer;

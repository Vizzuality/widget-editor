import React from "react";
import styled from "styled-components";

import Button from "components/button";

import { FOOTER_HEIGHT } from "style-constants";

const StyledFooter = styled.footer`
  width: 100%;
  height: ${FOOTER_HEIGHT};
  align-self: flex-end;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <Button type="highlight">Need help?</Button>
      <Button type="cta">Save widget</Button>
    </StyledFooter>
  );
};

export default Footer;

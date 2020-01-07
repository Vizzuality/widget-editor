import React from "react";
import styled from "styled-components";

import Chart from "components/chart";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  height: calc(100% - ${FOOTER_HEIGHT});
  background: #fff;
  flex: 1;
  ${DEFAULT_BORDER()}
`;

const Renderer = () => {
  return (
    <StyledContainer>
      <Chart />
    </StyledContainer>
  );
};

export default Renderer;

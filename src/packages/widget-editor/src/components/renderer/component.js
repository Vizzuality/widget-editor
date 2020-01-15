import React from "react";
import styled from "styled-components";

import Chart from "components/chart";
import SelectChart from "components/select-chart";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: calc(100% - ${FOOTER_HEIGHT});
  background: #fff;
  flex: 1;
  width: 100%;
  ${DEFAULT_BORDER()}
`;

const Renderer = () => {
  return (
    <StyledContainer>
      <SelectChart />
      <Chart />
    </StyledContainer>
  );
};

export default Renderer;

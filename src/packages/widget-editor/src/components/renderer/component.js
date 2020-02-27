import React from "react";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";

import Chart from "components/chart";
import QueryValues from "components/query-values";
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

const RestoringWidget = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RestoringWidgetTitle = styled.h4`
  color: #a9a9a9;
  font-size: 21px;
`

const Renderer = ({ widget, editor }) => {
  const { restoring, initialized } = editor;

  return (
    <StyledContainer>
      <SelectChart />
      {initialized && !restoring && <Chart />}
      {!initialized && (
        <RestoringWidget>
          <RestoringWidgetTitle>Loading widget...</RestoringWidgetTitle>
        </RestoringWidget>
      )}  
     {restoring && (
        <RestoringWidget>
          <RestoringWidgetTitle>Building widget...</RestoringWidgetTitle>
        </RestoringWidget>
      )}
      {initialized && !restoring && <QueryValues />}
    </StyledContainer>
  );
};

export default Renderer;

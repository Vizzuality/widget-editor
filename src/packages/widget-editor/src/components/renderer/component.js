import React from "react";

import Chart from "components/chart";
import QueryValues from "components/query-values";
import SelectChart from "components/select-chart";
import {
  StyledContainer,
  RestoringWidget,
  RestoringWidgetTitle
} from './style';

const Renderer = ({ widget, editor }) => {
  const { restoring, initialized } = editor;

  return (
    <StyledContainer>
      <SelectChart />
      
      {initialized && !restoring && <Chart />}
      {/* {initialized && !restoring && <QueryValues />} */}
      
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
    </StyledContainer>
  );
};

export default Renderer;

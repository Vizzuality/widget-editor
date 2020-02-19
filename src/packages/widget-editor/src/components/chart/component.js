import React, { useEffect, useRef } from "react";
import * as vega from "vega";
import styled from "styled-components";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

import ChartTheme from "helpers/theme";

const StyledContainer = styled.div`
  flex 1;
  display: flex;
  width: 100%;
  .c-chart {
    flex: 1;
    text-align: center;
    overflow: hidden;
    margin: 20px;
    max-height: 400px;
    align-self: center;
  }
`;

const Chart = ({ editor, widget }) => {
  const chart = useRef();
  const vegaContainer = useRef();
  const memoryStoreWidget = useRef();

  // TODO: CLEANUP, probably better to just utalise a traditional Rclass here
  useEffect(() => {
    if (
      chart.current &&
      !isEmpty(widget) &&
      !isEqual(widget, memoryStoreWidget)
    ) {
      const runtime = vega.parse(widget);
      const width = chart.current.offsetWidth;

      vegaContainer.current = new vega.View(runtime)
        .initialize(chart.current)
        .renderer("canvas")
        .width(width - 40)
        .hover()
        .run();
      memoryStoreWidget.current = widget;

      vegaContainer.current.resize = () => {
        const width = chart.current.offsetWidth;
        vegaContainer.current.width(width - 40).run();
      };

      window.addEventListener("resize", vegaContainer.current.resize);
    }
  }, [chart, editor, widget]);

  return (
    <StyledContainer>
      <div className="c-chart" ref={chart}></div>
    </StyledContainer>
  );
};

export default Chart;

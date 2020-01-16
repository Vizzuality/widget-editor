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
  }
`;

const Chart = ({ editor, widget }) => {
  const chart = useRef();
  const vegaContainer = useRef();
  const memoryStoreWidget = useRef();

  useEffect(() => {
    if (
      chart.current &&
      !isEmpty(widget) &&
      !isEqual(widget, memoryStoreWidget)
    ) {
      const width = chart.current.parentNode.offsetWidth;
      const runtime = vega.parse(widget);

      vegaContainer.current = new vega.View(runtime)
        .width(width / 2)
        .initialize(chart.current)
        .renderer("canvas")
        .hover()
        .run();
      memoryStoreWidget.current = widget;
    }
  }, [chart, editor, widget]);

  useEffect(() => {
    const handleResize = () => {
      const width = chart.current.parentNode.getBoundingClientRect().width;
      vegaContainer.current.signal("width", width / 2).run("enter");
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <StyledContainer>
      <div className="c-chart" ref={chart}></div>
    </StyledContainer>
  );
};

export default Chart;

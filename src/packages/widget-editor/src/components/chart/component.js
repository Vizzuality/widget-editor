import React, { useEffect, useRef } from "react";
import * as vega from "vega";
import vegaTooltip from "vega-tooltip";

import styled from "styled-components";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

import QueryValues from "components/query-values";

const StyledContainer = styled.div`
  /* flex 1; */
  display: flex;
  position: relative;
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

const getTooltipConfigFields = widget => {
  // We don't have the interaction config object defined
  if (
    !widget ||
    !widget.interaction_config ||
    !widget.interaction_config.length
  ) {
    return [];
  }

  const tooltipConfig = widget.interaction_config.find(
    c => c.name === "tooltip"
  );

  // We don't have the tooltip config defined
  if (
    !tooltipConfig ||
    !tooltipConfig.config ||
    !tooltipConfig.config.fields ||
    !tooltipConfig.config.fields.length
  ) {
    return [];
  }

  return tooltipConfig.config.fields;
};

const instantiateTooltip = (view, widget) => {
  const fields = getTooltipConfigFields(widget);
  const res = vegaTooltip(view, {
    showAllFields: false,
    fields: fields.map(({ column, property, type, format }) => ({
      field: column,
      title: property,
      formatType: type === "date" ? "time" : type,
      format
    }))
  });
};

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

      // We only show the tooltip if the interaction_config
      // object is defined
      if (
        vegaContainer.current &&
        widget.interaction_config &&
        widget.interaction_config.length
      ) {
        instantiateTooltip(vegaContainer.current, widget);
      }

      vegaContainer.current.resize = () => {
        if (chart && chart.current) {
          const width = chart.current.offsetWidth;
          vegaContainer.current.width(width - 40).run();
          instantiateTooltip(vegaContainer.current, widget);
        }
      };

      window.addEventListener("resize", vegaContainer.current.resize);
    }
  }, [chart, editor, widget]);

  return (
    <StyledContainer>
      <div className="c-chart" ref={chart}></div>
      <QueryValues />
    </StyledContainer>
  );
};

export default Chart;

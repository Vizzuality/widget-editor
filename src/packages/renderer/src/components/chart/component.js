import React from "react";
import * as vega from "vega";
import vegaTooltip from "vega-tooltip";

import styled from "styled-components";
import isEqual from "lodash/isEqual";

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

const getTooltipConfigFields = (widget) => {
  // We don't have the interaction config object defined
  if (
    !widget ||
    !widget.interaction_config ||
    !widget.interaction_config.length
  ) {
    return [];
  }

  const tooltipConfig = widget.interaction_config.find(
    (c) => c.name === "tooltip"
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
  vegaTooltip(view, {
    showAllFields: false,
    fields: fields.map(({ column, property, type, format }) => ({
      field: column,
      title: property,
      formatType: type === "date" ? "time" : type,
      format,
    })),
  });
};

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.vega = null;
  }

  componentDidMount() {
    this.generateVegaChart();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.widget, this.props.widget)) {
      this.generateVegaChart();
    }
  }

  generateVegaChart() {
    const { widget: vegaConfiguration } = this.props;

    const { chart } = this;

    const runtime = vega.parse(vegaConfiguration, vegaConfiguration.config);
    const width = chart.offsetWidth;
    this.vega = new vega.View(runtime)
      .initialize(chart)
      .renderer("canvas")
      .width(width - 40)
      .hover()
      .run();

    if (
      vegaConfiguration.interaction_config &&
      vegaConfiguration.interaction_config.length
    ) {
      instantiateTooltip(this.vega, vegaConfiguration);
    }

    this.vega.resize = () => {
      if (chart && chart.current) {
        const width = chart.current.offsetWidth;
        this.vega.width(width - 40).run();
        instantiateTooltip(this.vega, vegaConfiguration);
      }
    };

    window.addEventListener("resize", this.vega.resize);
  }

  render() {
    return (
      <StyledContainer>
        <div
          className="c-chart"
          ref={(c) => {
            this.chart = c;
          }}
        ></div>
        <QueryValues />
      </StyledContainer>
    );
  }
}

export default Chart;

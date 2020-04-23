import React, { Suspense } from "react";
import * as vega from "vega";
import vegaTooltip from "vega-tooltip";

import styled from "styled-components";
import isEqual from "lodash/isEqual";

const QueryValues = React.lazy(() => import("../query-values"));

const StyledContainer = styled.div`
  /* flex 1; */
  display: flex;
  position: relative;
  width: 100%;
  ${(props) =>
    props.compact &&
    `
        padding-bottom: 50px;
    `}

  .c-chart {
    flex: 1;
    text-align: center;
    overflow: hidden;
    margin: 20px;
    max-height: 400px;
    align-self: center;

    ${(props) =>
      props.thumbnail &&
      `
      margin: 0;  
      height: 100%;
      display: flex;
    `}

    ${(props) =>
      props.compact &&
      `
    height: 400px;
    `}
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
    this.standalone = props.standalone || false;
  }

  componentDidMount() {
    this.generateVegaChart();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.widget, this.props.widget)) {
      this.generateVegaChart();
    }
  }

  componentWillUnmount() {
    if (this.vega) {
      window.removeEventListener("resize", this.vega.resize);
    }
  }

  generateRuntime(configuration) {
    const { chart } = this;
    const runtime = vega.parse(configuration, configuration.config);
    const width = chart.offsetWidth;
    this.vega = new vega.View(runtime)
      .initialize(chart)
      .renderer("canvas")
      .width(width - 40)
      .hover()
      .run();

    if (
      configuration.interaction_config &&
      configuration.interaction_config.length
    ) {
      instantiateTooltip(this.vega, configuration);
    }

    this.vega.resize = () => {
      if (chart) {
        instantiateTooltip(this.vega, configuration);
      }
    };

    window.dispatchEvent(new Event("resize"));
    window.addEventListener("resize", this.vega.resize);
  }

  generateVegaChart() {
    const {
      widget: vegaConfiguration,
      standaloneConfiguration,
      thumbnail,
    } = this.props;

    if (this.standalone && standaloneConfiguration) {
      if (thumbnail) {
        let clearAxis = standaloneConfiguration;
        delete clearAxis.axisX;
        delete clearAxis.axisY;
        delete clearAxis.axes;
        delete clearAxis.axis;
        clearAxis.padding = 10;
        this.generateRuntime(clearAxis);
      } else {
        this.generateRuntime(standaloneConfiguration);
      }
    } else {
      this.generateRuntime(vegaConfiguration);
    }
  }

  render() {
    const { thumbnail } = this.props;

    return (
      <StyledContainer thumbnail={thumbnail} compact={this.props.compact}>
        <div
          className="c-chart"
          ref={(c) => {
            this.chart = c;
          }}
        ></div>
        {!this.standalone && (
          <Suspense fallback={<div>Loading...</div>}>
            <QueryValues compact={this.props.compact} />
          </Suspense>
        )}
      </StyledContainer>
    );
  }
}

export default Chart;

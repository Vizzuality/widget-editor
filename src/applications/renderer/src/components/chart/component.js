import React, { Suspense } from "react";
import * as vega from "vega";
import vegaTooltip from "vega-tooltip";

import styled from "styled-components";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

const QueryValues = React.lazy(() => import("../query-values"));

const StyledContainer = styled.div`
  position: relative;
  flex-grow: 1;
  flex: 1;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  ${(props) =>
    (props.standalone || props.thumbnail) &&
    `
      width: 100%;
    `}

  ${(props) =>
    props.compact &&
    `
        padding-bottom: 50px;
    `}

  .c-chart {
    position: relative;
    flex: 1;
    text-align: center;
    overflow: hidden;
    align-self: center;
    width: 100%;

    ${(props) =>
      !props.standalone &&
      `
      max-height: 400px;
    `}

    ${(props) =>
      props.compact &&
      `
    height: 400px;
    `}
  }
`;

const getTooltipConfigFields = (widget) => {
  const vegaConfig = widget;

  // We don't have the interaction config object defined
  if (
    !vegaConfig ||
    !vegaConfig.interaction_config ||
    !vegaConfig.interaction_config.length
  ) {
    return [];
  }

  const tooltipConfig = vegaConfig.interaction_config.find(
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
    this.handleResize = debounce(this.handleResize.bind(this), 250);
  }

  componentDidMount() {
    this.generateVegaChart();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.widget, this.props.widget)) {
      this.generateVegaChart();
    }
  }

  componentWillUnmount() {
    if (this.vega) {
      window.removeEventListener("resize", this.handleResize);
    }
  }

  setSize() {
    if (this.view) {
      const computedStyles = getComputedStyle(this.view);
      const boundingRect = this.view.getBoundingClientRect();
      const padding = {
        top: +computedStyles.paddingTop.replace("px", ""),
        right: +computedStyles.paddingRight.replace("px", ""),
        bottom: +computedStyles.paddingBottom.replace("px", ""),
        left: +computedStyles.paddingLeft.replace("px", ""),
      };
      this.width = boundingRect.width - 100 - (padding.left + padding.right);
      this.height = boundingRect.height - 100 - (padding.top + padding.bottom);
    }
  }

  handleResize() {
    const { view } = this;
    if (view) {
      this.setSize();
      this.vega
        .width(this.width)
        .height(this.height)
        .run();
    }
  }

  generateRuntime(configuration) {
    const { chart } = this;
    this.setSize();
    if (chart) {
      try {
        const runtime = vega.parse(configuration, configuration.config);
        this.vega = new vega.View(runtime)
          .initialize(chart)
          .renderer("canvas")
          .width(this.width)
          .height(this.height)
          .hover()
          .run();

        if (
          configuration.interaction_config &&
          configuration.interaction_config.length
        ) {
          instantiateTooltip(this.vega, configuration);
        }
      } catch (err) {
        console.error(
          "Widget editor error: Could not parse vega",
          err,
          configuration
        );
      }
    }
  }

  generateVegaChart() {
    const {
      thumbnail,
      widget: vegaConfiguration,
      standaloneConfiguration,
    } = this.props;

    if (this.standalone && standaloneConfiguration) {
      if (thumbnail) {
        let clearAxis = standaloneConfiguration;
        delete clearAxis.axisX;
        delete clearAxis.axisY;
        delete clearAxis.axes;
        delete clearAxis.axis;
        this.generateRuntime(clearAxis);
      } else {
        this.generateRuntime(standaloneConfiguration);
      }
    } else {
      this.generateRuntime(vegaConfiguration);
    }
  }

  render() {
    const { thumbnail, standalone } = this.props;
    return (
      <StyledContainer
        standalone={standalone}
        thumbnail={thumbnail}
        compact={this.props.compact}
        ref={(c) => {
          this.view = c;
        }}
      >
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

Chart.defaultProps = {
  width: 0,
  height: 0,
};

export default Chart;

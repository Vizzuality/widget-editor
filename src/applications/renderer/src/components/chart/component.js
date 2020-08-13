import React, { Fragment, Suspense } from "react";
import * as vega from "vega";
import { vega as vegaTooltip }  from "vega-tooltip";

import { ParseSignals } from "@widget-editor/core";

import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";

import { StyledContainer, ChartNeedsOptions } from "./styles";

const ColumnSelections = React.lazy(() => import("../column-selections"));

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


class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.vega = null;
    this.state = {
      chartReady: false
    }
    this.standalone = props.standalone || false;
    this.handleResize = debounce(this.handleResize.bind(this), 250);
  }

  componentDidMount() {
    this.generateVegaChart();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps) {
    const widgetChanged = !isEqual(prevProps.widget, this.props.widget);
    const standaloneConfigChanged =
      !isEqual(prevProps.standaloneConfiguration, this.props.standaloneConfiguration);

    if (widgetChanged || standaloneConfigChanged) {
      this.generateVegaChart();
    }
  }

  componentWillUnmount() {
    if (this.vega) {
      window.removeEventListener("resize", this.handleResize);
      this.vega = null;
      this.setState({ chartReady: false, invalidData: false });
      this.chart.innerHTML = '';
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

      this.width = boundingRect.width - (padding.left + padding.right);
      this.height = boundingRect.height - (padding.top + padding.bottom);
    }
  }

  handleResize() {
    const { view } = this;
    if (view) {
      this.setSize();
      if (this.vega) {
      this.vega
        .width(this.width)
        // .height(this.height) // This is a test, currently the renderer resizes its height
        .run();
      }
    }
  }

  instantiateTooltip(widget) {
    const fields = getTooltipConfigFields(widget);
    vegaTooltip(this.vega, {
      showAllFields: false,
      fields: fields.map(({ column, property, type, format }) => ({
        field: column,
        title: property,
        formatType: type === "date" ? "time" : type,
        format,
      })),
    });
  };

  generateRuntime(configuration) {
    const { chart } = this;
    this.setSize();
    if (chart) {
      try {
        let conf;
        if (this.standalone) {
          const parseSignals = new ParseSignals(
            configuration,
            configuration.paramsConfig,
            configuration?.paramsConfig?.category?.type === 'date',
            this.props.standalone
          );
          conf = {
            ...configuration,
            marks: parseSignals.parseLegacy()
          }
        } else {
          conf = configuration;
        }

        const runtime = vega.parse(conf, configuration.config);

        this.vega = new vega.View(runtime)
          .initialize(chart)
          .renderer("canvas")
          .width(this.width)
          .height(this.height)
          .hover()
          .run();

        if (
          configuration.interaction_config &&
          configuration.interaction_config.length &&
          !this.props.thumbnail
        ) {
          this.instantiateTooltip(configuration);
        }
        this.setState({ chartReady: true });
      } catch (err) {
        console.error(
          "Widget editor error: Could not parse vega",
          err,
          configuration
        );
      }
    }
  }

  noDataAvailable() {
    return !this.standalone &&
      !this.props.advanced &&
      (!this.props.editor.widgetData || this.props.editor.widgetData.length === 0);
  }

  // XXX: makes sure custom charts has nessesary info to render
  verifyCustomChart(conf) {
    const axisY = conf?.config?.axisY || {};
    delete axisY.labelAlign;
    delete axisY.labelBaseline;
    const config = conf.hasOwnProperty('config') ? {
      ...conf.config,
        axisY: {
          ...axisY,
          minExtent: 40
        }
    } : {}
    return {
      ...conf,
      config
    }
  }

  generateVegaChart() {
    const {
      advanced,
      thumbnail,
      widget: vegaConfiguration,
      standaloneConfiguration,
    } = this.props;

    if (this.noDataAvailable()) {
      if (this.vega) {
        window.removeEventListener("resize", this.handleResize);
        this.vega = null;
        this.setState({ chartReady: false, invalidData: true });
      }
      return;
    } else {
      this.setState({ invalidData: false });
    }

    if (this.standalone && standaloneConfiguration) {
      if (thumbnail) {
        let clearAxis = standaloneConfiguration;
        delete clearAxis.axisX;
        delete clearAxis.axisY;
        delete clearAxis.axes;
        delete clearAxis.axis;
        this.generateRuntime(clearAxis);
      } else {
        this.generateRuntime(this.verifyCustomChart(standaloneConfiguration));
      }
    } else {
      // XXX: Remove any nessesary information if not advanced mode
      // This is for example if:
      // 1. User deletes the entire custom configuration
      if (!advanced) {
        delete vegaConfiguration.legends;
      }
      this.generateRuntime(vegaConfiguration);
    }
  }

  columnSelection() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ColumnSelections compact={this.props.compact} />
      </Suspense>
    );
  }

  render() {
    const { thumbnail, standalone, advanced = false } = this.props;
    const { chartReady, invalidData } = this.state;

    return (
      <StyledContainer
        standalone={standalone}
        thumbnail={thumbnail}
        compact={this.props.compact}
        ref={(c) => {
          this.view = c;
        }}
      >
        {!this.noDataAvailable() && <div
          className="c-chart"
          ref={(c) => {
            this.chart = c;
          }}
        ></div>}
        {this.noDataAvailable() && (
          <Fragment>
            {chartReady && <ChartNeedsOptions>
              Select value & category to visualize data
            </ChartNeedsOptions>}
            {invalidData && <ChartNeedsOptions>
              No data available
            </ChartNeedsOptions>}
            {this.columnSelection()}
          </Fragment>
        )}

        {!this.standalone && !advanced && this.columnSelection()}
      </StyledContainer>
    );
  }
}

Chart.defaultProps = {
  width: 0,
  height: 0,
};

export default Chart;

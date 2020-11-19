import React, { Fragment, Suspense } from "react";
import PropTypes from 'prop-types';
import * as vega from "vega";
import { vega as vegaTooltip }  from "vega-tooltip";

import { JSTypes } from "@widget-editor/types";

import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import has from "lodash/has";

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
    this.tooltip = vegaTooltip(this.vega, {
      showAllFields: false,
      fields: fields.map(({ column, property, type, format }) => ({
        field: column,
        title: property,
        formatType: type === "date" ? "time" : type,
        format,
      })),
    });
  }

  generateRuntime(configuration) {
    const { chart } = this;
    this.setSize();
    if (chart) {
      try {
        // To avoid memory leaks, the view is destroyed when a new one is created
        if (this.vega) {
          this.vega.finalize();
        }

        const runtime = vega.parse(configuration, configuration.config);

        this.vega = new vega.View(runtime)
          .initialize(chart)
          // If the renderer is canvas, the fonts defined in the `config` object will be ignored
          .renderer("svg")
          .width(this.width)
          .height(this.height)
          .hover()
          .run();

        // The version of vega-tooltip we're using doesn't remove the tooltip when the view is
        // destroyed
        // Here we overwrite Vega's finalize function to destroy the tooltip when the view does so
        const vegaFinalize = this.vega.finalize.bind(this.vega);
        this.vega.finalize = () => {
          if (this.tooltip) {
            // destroy only removes the event handlers:
            // https://github.com/vega/vega-tooltip/blob/262e723c5270cee105fcf1d79135750b3028269a/src/index.ts#L20-L27
            this.tooltip.destroy();

            // The ID of the tooltip is hard-coded in vega-tooltip so we're fine hard-coding it
            // here too
            const tooltip = document.getElementById('vis-tooltip');
            if (tooltip) {
              tooltip.remove();
            }
          }

          vegaFinalize();
        };

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
    const config = has(conf, "config") ? {
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
      const editedConfiguration = { ...vegaConfiguration };

      // XXX: Remove any nessesary information if not advanced mode
      // This is for example if:
      // 1. User deletes the entire custom configuration
      if (!advanced) {
        delete editedConfiguration.legends;
      }

      // If not standalone, we don't want to show the axes titles
      editedConfiguration.axes = [...editedConfiguration.axes];
      editedConfiguration.axes?.forEach((axis, index) => {
        if (axis.title) {
          editedConfiguration.axes[index] = { ...axis };
          delete editedConfiguration.axes[index].title;
        }
      });

      this.generateRuntime(editedConfiguration);
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
    const { thumbnail, standalone, advanced = false, configuration: { chartType } } = this.props;
    const { chartReady, invalidData } = this.state;

    return (
      <StyledContainer
        standalone={standalone}
        thumbnail={thumbnail}
        compact={this.props.compact}
        hasYAxis={chartType !== "pie" && chartType !== "donut"}
        ref={(c) => {
          this.view = c;
        }}
      >
        {!this.noDataAvailable() && (
          <div
            className="c-chart"
            ref={(c) => {
              this.chart = c;
            }}
          />
        )}

        {this.noDataAvailable() && (
          <Fragment>
            {chartReady && (
              <ChartNeedsOptions>
                Select value & category to visualize data
              </ChartNeedsOptions>
            )}
            {invalidData && (
              <ChartNeedsOptions>
                No data available
              </ChartNeedsOptions>
            )}
          </Fragment>
        )}

        {!this.standalone && !advanced && this.columnSelection()}
      </StyledContainer>
    );
  }
}

Chart.propTypes = {
  editor: PropTypes.shape({
    widgetData: PropTypes.array
  }),
  configuration: JSTypes.configuration,
  standalone: PropTypes.bool,
  thumbnail: PropTypes.bool,
  compact: PropTypes.any,
  widget: PropTypes.object,
  standaloneConfiguration: PropTypes.object,
  advanced: PropTypes.bool
};

Chart.defaultProps = {
  width: 0,
  height: 0,
};

export default Chart;

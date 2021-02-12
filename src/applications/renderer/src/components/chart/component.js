import React from "react";
import PropTypes from 'prop-types';
import * as vega from "vega";
import { vega as vegaTooltip }  from "vega-tooltip";

import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";


import { StyledContainer } from "./styles";

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
    this.handleResize = debounce(this.handleResize.bind(this), 250);
  }

  componentDidMount() {
    this.generateVegaChart();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps) {
    const widgetConfigChanged = !isEqual(prevProps.widgetConfig, this.props.widgetConfig);

    if (widgetConfigChanged) {
      this.generateVegaChart();
    }
  }

  componentWillUnmount() {
    if (this.vega) {
      window.removeEventListener("resize", this.handleResize);
      this.vega = null;
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
      // This requestAnimationFrame makes sure that the size is computed when the browser has
      // finished computing the layout
      requestAnimationFrame(() => {
        this.setSize();

        if (this.vega) {
          this.vega
            .width(this.width)
            .run();
        }
      });
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

  generateVegaChart() {
    const { thumbnail, widgetConfig } = this.props;

    // This requestAnimationFrame makes sure that the size is computed when the browser has finished
    // computing the layout
    requestAnimationFrame(() => {
      this.setSize();

      if (thumbnail) {
        const widgetConfigWithoutAxes = { ...widgetConfig };
        delete widgetConfigWithoutAxes.axisX;
        delete widgetConfigWithoutAxes.axisY;
        delete widgetConfigWithoutAxes.axes;
        delete widgetConfigWithoutAxes.axis;
        this.generateRuntime(widgetConfigWithoutAxes);
      } else {
        this.generateRuntime(widgetConfig);
      }
    });
  }

  render() {
    const { thumbnail } = this.props;

    return (
      <StyledContainer
        className="c-renderer"
        thumbnail={thumbnail}
        ref={(c) => {
          this.view = c;
        }}
      >
        <div
          className="c-chart"
          ref={(c) => {
            this.chart = c;
          }}
        />
      </StyledContainer>
    );
  }
}

Chart.propTypes = {
  thumbnail: PropTypes.bool,
  widgetConfig: PropTypes.object,
};

export default Chart;

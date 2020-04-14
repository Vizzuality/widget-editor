function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { useState, useEffect } from "react";
import Slider from "../slider";
import isEqual from "lodash/isEqual";
import FlexContainer from "../../styles-common/flex";
import FormLabel from "../../styles-common/form-label";
import InputGroup from "../../styles-common/input-group";
import Input from "../../styles-common/input";
import debounce from "lodash/debounce";
import * as helpers from "./helpers";

class WidgetInfo extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleUpdate", debounce(() => {
      const {
        configuration,
        patchConfiguration
      } = this.props;
      const {
        title,
        caption,
        yAxis,
        xAxis
      } = this.state;
      patchConfiguration({
        title,
        caption,
        xAxisTitle: xAxis,
        yAxisTitle: yAxis,
        category: { ...configuration.category
        },
        value: { ...configuration.value
        }
      });
    }, 1000));

    this.state = this.stateFromProps(props.configuration);
  }

  componentDidUpdate(prevProps) {
    const {
      configuration: prevConfiguration
    } = prevProps;
    const {
      configuration
    } = this.props;

    if (!isEqual(this.stateFromProps(prevConfiguration), this.stateFromProps(configuration))) {
      this.setState(this.stateFromProps(configuration));
    }
  }

  stateFromProps(configuration) {
    return {
      title: configuration ? configuration.title : "",
      caption: configuration ? configuration.caption : "",
      yAxis: configuration ? configuration.category.alias : "",
      xAxis: configuration ? configuration.value.alias : ""
    };
  }

  setTitle(title) {
    this.setState({
      title
    });
    this.handleUpdate();
  }

  setCaption(caption) {
    this.setState({
      caption
    });
    this.handleUpdate();
  }

  setYAxis(yAxis) {
    this.setState({
      yAxis
    });
    this.handleUpdate();
  }

  setXAxis(xAxis) {
    this.setState({
      xAxis
    });
    this.handleUpdate();
  }

  render() {
    const {
      title,
      caption,
      xAxis,
      yAxis
    } = this.state;
    return React.createElement(FlexContainer, null, React.createElement(InputGroup, null, React.createElement(FormLabel, {
      htmlFor: "options-title"
    }, "Title"), React.createElement(Input, {
      type: "text",
      placeholder: "Add title",
      name: "options-title",
      value: title,
      onChange: e => this.setTitle(e.target.value)
    })), React.createElement(InputGroup, null, React.createElement(FormLabel, {
      htmlFor: "options-title"
    }, "Caption"), React.createElement(Input, {
      type: "text",
      placeholder: "Add caption",
      name: "options-capton",
      value: caption,
      onChange: e => this.setCaption(e.target.value)
    })), React.createElement(FlexContainer, {
      row: true
    }, React.createElement(InputGroup, null, React.createElement(FormLabel, {
      htmlFor: "options-x-axis"
    }, "X axis"), React.createElement(Input, {
      type: "text",
      placeholder: "Overwrite axis name",
      name: "options-x-axis",
      value: xAxis,
      onChange: e => this.setXAxis(e.target.value)
    })), React.createElement(InputGroup, null, React.createElement(FormLabel, {
      htmlFor: "options-y-axis"
    }, "Y axis"), React.createElement(Input, {
      type: "text",
      placeholder: "Overwrite axis name",
      name: "options-y-axis",
      value: yAxis,
      onChange: e => this.setYAxis(e.target.value)
    }))));
  }

}

export default WidgetInfo;
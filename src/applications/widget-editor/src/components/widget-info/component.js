import React from "react";
import isEqual from "lodash/isEqual";

import FlexContainer from "styles-common/flex";
import InputInfo from "styles-common/input-info";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import debounce from "lodash/debounce";
import { Select } from "@widget-editor/shared";

import { InputStyles } from "./style";

import VALUE_FORMAT_OPTIONS from "@widget-editor/shared/lib/constants/value-formats";
import AGGREGATION_OPTIONS from "@widget-editor/shared/lib/constants/aggregations";

class WidgetInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props.configuration);

    this.setValueFormat = this.setValueFormat.bind(this);
    this.setAggregation = this.setAggregation.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { configuration: prevConfiguration } = prevProps;
    const { configuration } = this.props;

    if (
      !isEqual(
        this.stateFromProps(prevConfiguration),
        this.stateFromProps(configuration)
      )
    ) {
      this.setState(this.stateFromProps(configuration));
    }
  }

  stateFromProps(configuration) {
    return {
      title: configuration?.title ? configuration.title : "",
      description: configuration?.description ? configuration.description : "",
      caption: configuration?.caption ? configuration.caption : "",
      xAxisTitle: configuration?.xAxisTitle ? configuration.xAxisTitle : "",
      yAxisTitle: configuration?.yAxisTitle ? configuration.yAxisTitle : "",
      aggregateFunction: configuration?.aggregateFunction
        ? configuration.aggregateFunction
        : null,
      format: this.resolveFormat(configuration),
    };
  }

  resolveFormat(configuration) {
    const format = configuration?.value?.format || "s";
    const selectedFormat = VALUE_FORMAT_OPTIONS.find((f) => f.value === format);
    if (!selectedFormat && format && format !== "s") {
      return {
        label: format,
        value: format,
      };
    }
    return selectedFormat;
  }

  handleUpdate = debounce(() => {
    const { configuration, patchConfiguration } = this.props;
    const {
      title,
      description,
      caption,
      yAxisTitle,
      xAxisTitle,
      aggregateFunction,
      format,
    } = this.state;
    patchConfiguration({
      title,
      description,
      caption,
      format: format?.value || "s",
      yAxisTitle: yAxisTitle,
      xAxisTitle: xAxisTitle,
      aggregateFunction: aggregateFunction,
      category: { ...configuration.category },
      value: { ...configuration.value, format: format?.value || "s" },
    });
  }, 300);

  setTitle(title) {
    this.setState({ title });
    this.handleUpdate();
  }

  setDescription(description) {
    this.setState({ description });
    this.handleUpdate();
  }

  setCaption(caption) {
    this.setState({ caption });
    this.handleUpdate();
  }

  setYAxis(yAxisTitle) {
    this.setState({ yAxisTitle });
    this.handleUpdate();
  }

  setXAxis(xAxisTitle) {
    this.setState({ xAxisTitle });
    this.handleUpdate();
  }

  setValueFormat(format) {
    this.setState({ format });
    this.handleUpdate();
  }

  setAggregation(agg) {
    this.setState({
      aggregateFunction: agg ? agg.value : null,
    });
    this.handleUpdate();
  }

  render() {
    const {
      title,
      description,
      caption,
      yAxisTitle,
      xAxisTitle,
      aggregateFunction,
      format,
    } = this.state;
    const { isMap, advanced } = this.props;
    return (
      <FlexContainer>
        <InputGroup>
          <FormLabel htmlFor="options-title">Title</FormLabel>
          <Input
            type="text"
            placeholder="Add title"
            id="options-title"
            name="options-title"
            value={title}
            onChange={(e) => this.setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <FormLabel htmlFor="options-description">Description</FormLabel>
          <Input
            type="text"
            id="options-description"
            placeholder="Add description"
            name="options-decription"
            value={description}
            onChange={(e) => this.setDescription(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <FormLabel htmlFor="options-caption">Caption</FormLabel>
          <Input
            type="text"
            placeholder="Add caption"
            id="options-caption"
            name="options-caption"
            value={caption}
            onChange={(e) => this.setCaption(e.target.value)}
          />
        </InputGroup>
        {!isMap && !advanced && (
          <FlexContainer row={true}>
            <InputGroup>
              <FormLabel htmlFor="options-value">Value</FormLabel>
              <Input
                type="text"
                placeholder="Overwrite value axis name"
                id="options-value"
                name="options-value"
                value={yAxisTitle}
                onChange={(e) => this.setYAxis(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <FormLabel htmlFor="options-category">Category</FormLabel>
              <Input
                type="text"
                placeholder="Overwrite category axis name"
                id="options-category"
                name="options-category"
                value={xAxisTitle}
                onChange={(e) => this.setXAxis(e.target.value)}
              />
            </InputGroup>
          </FlexContainer>
        )}
        {!isMap && !advanced && (
          <InputGroup>
            <FormLabel htmlFor="options-value-aggregation">Value aggregation</FormLabel>
            <Select
              id="options-value-aggregation"
              value={AGGREGATION_OPTIONS.find(agg => agg.value === aggregateFunction)}
              options={AGGREGATION_OPTIONS}
              onChange={this.setAggregation}
              isClearable
            />
          </InputGroup>
        )}
        {!isMap && !advanced && (
          <InputGroup>
            <FormLabel htmlFor="options-value-format">Value format</FormLabel>
            <Select
              id="options-value-format"
              creatable
              value={format}
              options={VALUE_FORMAT_OPTIONS}
              onChange={this.setValueFormat}
            />
            <InputInfo>
              We are using d3-format for formating values, you can input your
              own format or select a predefined one from the list. Read more
              about formats:{" "}
              <a href="https://github.com/d3/d3-format" target="__BLANK">
                here
              </a>
              .
            </InputInfo>
          </InputGroup>
        )}
      </FlexContainer>
    );
  }
}

export default WidgetInfo;

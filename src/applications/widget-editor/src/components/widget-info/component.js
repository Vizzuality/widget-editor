import React from "react";
import isEqual from "lodash/isEqual";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import debounce from "lodash/debounce";
import Select from "react-select";

import { InputStyles } from "./style";

import VALUE_FORMAT_OPTIONS from "@widget-editor/shared/lib/constants/value-formats";

class WidgetInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props.configuration);

    this.setValueFormat = this.setValueFormat.bind(this);
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
      caption: configuration?.caption ? configuration.caption : "",
      yAxis: configuration?.category?.alias ? configuration.category.alias : "",
      xAxis: configuration?.value?.alias ? configuration.value.alias : "",
      format: this.resolveFormat(configuration),
    };
  }

  resolveFormat(configuration) {
    const format = configuration?.value?.format || "s";
    const selectedFormat = VALUE_FORMAT_OPTIONS.find((f) => f.value === format);
    return selectedFormat;
  }

  handleUpdate = debounce(() => {
    const { configuration, patchConfiguration } = this.props;
    const { title, caption, yAxis, xAxis, format } = this.state;
    patchConfiguration({
      title,
      caption,
      format: format.value,
      xAxisTitle: xAxis,
      yAxisTitle: yAxis,
      category: { ...configuration.category },
      value: { ...configuration.value, format: format.value },
    });
  }, 1000);

  setTitle(title) {
    this.setState({ title });
    this.handleUpdate();
  }

  setCaption(caption) {
    this.setState({ caption });
    this.handleUpdate();
  }

  setYAxis(yAxis) {
    this.setState({ yAxis });
    this.handleUpdate();
  }

  setXAxis(xAxis) {
    this.setState({ xAxis });
    this.handleUpdate();
  }

  setValueFormat(format) {
    this.setState({ format });
    this.handleUpdate();
  }

  render() {
    const { title, caption, xAxis, yAxis, format } = this.state;

    return (
      <FlexContainer>
        <InputGroup>
          <FormLabel htmlFor="options-title">Title</FormLabel>
          <Input
            type="text"
            placeholder="Add title"
            name="options-title"
            value={title}
            onChange={(e) => this.setTitle(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <FormLabel htmlFor="options-title">Caption</FormLabel>
          <Input
            type="text"
            placeholder="Add caption"
            name="options-capton"
            value={caption}
            onChange={(e) => this.setCaption(e.target.value)}
          />
        </InputGroup>
        <FlexContainer row={true}>
          <InputGroup>
            <FormLabel htmlFor="options-x-axis">X axis</FormLabel>
            <Input
              type="text"
              placeholder="Overwrite axis name"
              name="options-x-axis"
              value={xAxis}
              onChange={(e) => this.setXAxis(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <FormLabel htmlFor="options-y-axis">Y axis</FormLabel>
            <Input
              type="text"
              placeholder="Overwrite axis name"
              name="options-y-axis"
              value={yAxis}
              onChange={(e) => this.setYAxis(e.target.value)}
            />
          </InputGroup>
        </FlexContainer>
        <InputGroup>
          <FormLabel htmlFor="options-title">Value format</FormLabel>
          <Select
            value={format}
            onChange={this.setValueFormat}
            options={VALUE_FORMAT_OPTIONS}
            styles={InputStyles}
          />
        </InputGroup>
      </FlexContainer>
    );
  }
}

export default WidgetInfo;

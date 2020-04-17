import React from "react";
import isEqual from "lodash/isEqual";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";
import debounce from "lodash/debounce";

class WidgetInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props.configuration);
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
    };
  }

  handleUpdate = debounce(() => {
    const { configuration, patchConfiguration } = this.props;
    const { title, caption, yAxis, xAxis } = this.state;
    patchConfiguration({
      title,
      caption,
      xAxisTitle: xAxis,
      yAxisTitle: yAxis,
      category: { ...configuration.category },
      value: { ...configuration.value },
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

  render() {
    const { title, caption, xAxis, yAxis } = this.state;

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
      </FlexContainer>
    );
  }
}

export default WidgetInfo;

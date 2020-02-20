import React, { useState, useEffect } from "react";
import Slider from "components/slider";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import * as helpers from "./helpers";

const WidgetInfo = ({ theme, configuration, patchConfiguration }) => {
  const [title, setTitle] = useState(configuration.title);
  const [caption, setCaption] = useState(configuration.caption);
  const [xaxis, setXaxis] = useState(configuration.category.alias || "");
  const [yaxis, setYaxis] = useState(configuration.value.alias || "");

  const debounceTitle = useDebounce(title, 500);
  const debounceCaption = useDebounce(caption, 500);
  const debounceXaxis = useDebounce(xaxis, 500);
  const debounceYaxis = useDebounce(yaxis, 500);

  const handleChange = e => {
    setLimit(e.target.value);
  };

  const handleOnChange = (value, type) => {
    if (type === "title") {
      setTitle(value);
    }
    if (type === "caption") {
      setCaption(value);
    }
    if (type === "xaxis") {
      setXaxis(value);
    }
    if (type === "yaxis") {
      setYaxis(value);
    }
  };

  useEffect(() => {
    if (helpers.hasUpdate(debounceTitle, configuration.title)) {
      patchConfiguration({ title: debounceTitle });
    }
    if (helpers.hasUpdate(debounceCaption, configuration.caption)) {
      patchConfiguration({ caption: debounceCaption });
    }
    if (helpers.hasUpdate(debounceXaxis, configuration.category.name)) {
      patchConfiguration({
        category: { ...configuration.category, alias: debounceXaxis }
      });
    }
    if (helpers.hasUpdate(debounceYaxis, configuration.value.name)) {
      patchConfiguration({
        value: { ...configuration.value, alias: debounceYaxis }
      });
    }
  }, [debounceTitle, debounceCaption, debounceXaxis, debounceYaxis]);

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Title</FormLabel>
        <Input
          type="text"
          placeholder="Add title"
          name="options-title"
          value={title}
          onChange={e => handleOnChange(e.target.value, "title")}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-title">Caption</FormLabel>
        <Input
          type="text"
          placeholder="Add caption"
          name="options-capton"
          value={caption}
          onChange={e => handleOnChange(e.target.value, "caption")}
        />
      </InputGroup>
      <FlexContainer row={true}>
        <InputGroup>
          <FormLabel htmlFor="options-x-axis">X axis</FormLabel>
          <Input
            type="text"
            placeholder="Overwrite axis name"
            name="options-x-axis"
            value={xaxis}
            onChange={e => handleOnChange(e.target.value, "xaxis")}
          />
        </InputGroup>
        <InputGroup>
          <FormLabel htmlFor="options-y-axis">Y axis</FormLabel>
          <Input
            type="text"
            placeholder="Overwrite axis name"
            name="options-y-axis"
            value={yaxis}
            onChange={e => handleOnChange(e.target.value, "yaxis")}
          />
        </InputGroup>
      </FlexContainer>
    </FlexContainer>
  );
};

export default WidgetInfo;

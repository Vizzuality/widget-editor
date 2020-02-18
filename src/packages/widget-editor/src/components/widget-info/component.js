import React, { useState, useEffect } from "react";
import Slider from "components/slider";

import useDebounce from "hooks/use-debounce";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import Input from "styles-common/input";

import * as helpers from "./helpers";

const WidgetInfo = ({ theme, configuration, patchConfiguration }) => {
  const [title, setTitle] = useState(configuration.title);
  const [caption, setCaption] = useState(configuration.caption);

  const debounceTitle = useDebounce(title, 500);
  const debounceCaption = useDebounce(caption, 500);

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
  };

  useEffect(() => {
    if (helpers.hasUpdate(debounceTitle, configuration.title)) {
      patchConfiguration({ title: debounceTitle });
    }
    if (helpers.hasUpdate(debounceCaption, configuration.caption)) {
      patchConfiguration({ caption: debounceCaption });
    }
  }, [debounceTitle, debounceCaption]);

  return (
    <FlexContainer>
      <FormLabel htmlFor="options-title">Title</FormLabel>
      <Input
        type="text"
        name="options-title"
        value={title}
        onChange={e => handleOnChange(e.target.value, "title")}
      />
      <FormLabel htmlFor="options-title">Caption</FormLabel>
      <Input
        type="text"
        name="options-capton"
        value={caption}
        onChange={e => handleOnChange(e.target.value, "caption")}
      />
    </FlexContainer>
  );
};

export default WidgetInfo;

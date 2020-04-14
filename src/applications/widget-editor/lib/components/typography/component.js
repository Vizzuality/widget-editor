import React from 'react';
import FlexContainer from "../../styles-common/flex";
import FormLabel from "../../styles-common/form-label";
import InputGroup from "../../styles-common/input-group";
import Input from "../../styles-common/input";
import Select from 'react-select';
import { FONTS } from "./const";
import { InputStyles } from "./style";

const Typography = ({
  theme,
  setTheme
}) => {
  const {
    font,
    titleSize,
    captionSize,
    axisTitleSize
  } = theme;
  const selectedFont = FONTS.find(f => f.value === font) || FONTS[0];

  const handleChangeFont = option => {
    setTheme({ ...theme,
      font: option.value
    });
  };

  const handleChangeSize = (key, value) => {
    const reg = new RegExp('^[0-9]*$');
    const setValue = value !== '' && reg.test(Number(value)) ? value : 'auto';
    setTheme({ ...theme,
      [key]: setValue
    });
  };

  return React.createElement("div", null, React.createElement(FormLabel, {
    htmlFor: "options-title"
  }, "Font"), React.createElement(Select, {
    value: selectedFont,
    onChange: handleChangeFont,
    options: FONTS,
    styles: InputStyles
  }), React.createElement("br", null), React.createElement(FlexContainer, {
    row: true
  }, React.createElement(InputGroup, null, React.createElement(FormLabel, {
    htmlFor: "typography-title-size"
  }, "Title size"), React.createElement(Input, {
    name: "typography-title-size",
    value: titleSize === "auto" ? '' : titleSize,
    type: "text",
    onChange: e => handleChangeSize('titleSize', e.target.value),
    placeholder: "Auto"
  })), React.createElement(InputGroup, null, React.createElement(FormLabel, {
    htmlF: true,
    or: "typography-caption-size"
  }, "Caption size"), React.createElement(Input, {
    name: "typography-caption-size",
    value: captionSize === "auto" ? '' : captionSize,
    type: "text",
    onChange: e => handleChangeSize('captionSize', e.target.value),
    placeholder: "Auto"
  })), React.createElement(InputGroup, null, React.createElement(FormLabel, {
    htmlFor: "typography-axisTitleSize"
  }, "Axis title size"), React.createElement(Input, {
    name: "typography-axisTitleSize",
    value: axisTitleSize === "auto" ? '' : axisTitleSize,
    type: "text",
    onChange: e => handleChangeSize('axisTitleSize', e.target.value),
    placeholder: "Auto"
  }))));
};

export default Typography;
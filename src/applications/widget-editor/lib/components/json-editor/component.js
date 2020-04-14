import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { StyledField, EditorColors, EditorStyles } from "./style";

const JsonEditor = ({
  json,
  onChange = () => {}
}) => {
  return React.createElement(StyledField, null, React.createElement(JSONInput, {
    placeholder: json,
    colors: EditorColors,
    locale: locale,
    style: EditorStyles,
    onChange: onChange
  }));
};

export default JsonEditor;
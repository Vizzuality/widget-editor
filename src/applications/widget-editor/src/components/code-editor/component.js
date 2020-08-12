import React from "react";
import PropTypes from "prop-types";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";

import { StyledField, EditorStyles } from "./style";

const CodeEditor = ({ id, value, disabled, invalid, onChange, type, ...props }) => {
  return (
    // We can't disable the editor itself, but we can update its styles and don't save what the user
    // changes
    <StyledField disabled={disabled} invalid={invalid}>
      <EditorStyles>
        <Editor
          textareaId={id}
          value={value}
          onValueChange={(code) => onChange(code)}
          highlight={(code) => highlight(code, languages[type])}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
          {...props}
        />
      </EditorStyles>
    </StyledField>
  );
};

CodeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
};

CodeEditor.defaultProps = {
  disabled: false,
  type: 'json',
  invalid: false,
  onChange: () => {},
};

export default CodeEditor;

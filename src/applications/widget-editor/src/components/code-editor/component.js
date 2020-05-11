import React from "react";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sql";

import { StyledField, EditorStyles } from "./style";

const CodeEditor = ({ data, onChange = () => {}, type = "json" }) => {
  return (
    <StyledField>
      <EditorStyles>
        <Editor
          value={data}
          onValueChange={(code) => onChange(code)}
          highlight={(code) => highlight(code, languages[type])}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
          }}
        />
      </EditorStyles>
    </StyledField>
  );
};

export default CodeEditor;

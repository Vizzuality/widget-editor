import React from "react";

import useEditorHook from "./hooks/use-editor-hook";

const Editor = ({ editor, setEditor }) => {
  const [loading] = useEditorHook(editor, setEditor);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <p>Im an editor</p>;
};

export default Editor;

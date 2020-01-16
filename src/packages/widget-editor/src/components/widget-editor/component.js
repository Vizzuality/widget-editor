import React from "react";
import Editor from "components/editor";

class WidgetEditor extends React.Component {
  render() {
    const { adapter, theme } = this.props;
    return <Editor adapter={adapter} theme={theme} />;
  }
}

export default WidgetEditor;

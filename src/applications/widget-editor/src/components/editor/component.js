import React from "react";

import RwAdapter from "@packages/rw-adapter";
import WidgetEditor from "@packages/widget-editor";

class Editor extends React.Component {
  constructor(props) {
    super(props);
  }
  handleOnSave(diff) {
    console.log("on save called from consumer with:");
    console.log(diff);
  }

  render() {
    const {
      editorOptions: { authToken, dataset, theme }
    } = this.props;

    const authenticated = !!authToken && authToken.length > 0;

    return (
      <div className="widget-editor-wrapper">
        <WidgetEditor
          datasetId={dataset}
          onSave={this.handleOnSave}
          authenticated={authenticated}
          adapter={RwAdapter}
          theme={theme}
        />
      </div>
    );
  }
}

export default Editor;

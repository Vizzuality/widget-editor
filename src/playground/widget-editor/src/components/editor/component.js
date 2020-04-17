import React from "react";

import RwAdapter from "@widget-editor/rw-adapter";
import WidgetEditor from "@widget-editor/widget-editor";

const THEMES = [
  {
    name: "pine",
    mainColor: "#907A59",
    category: [
      "#907A59",
      "#6AAC9F",
      "#D5C0A1",
      "#5C7D86",
      "#F9AF38",
      "#F05B3F",
      "#89AD24",
      "#CE4861",
      "#F5808F",
      "#86C48F",
      "#F28627",
      "#B23912",
      "#BAD6AF",
      "#C9C857",
      "#665436",
    ],
  },
  {
    name: "wind",
    mainColor: "#5A7598",
    category: [
      "#5A7598",
      "#C1CCDC",
      "#DBB86F",
      "#B7597B",
      "#5FAB55",
      "#8D439E",
      "#CD87CA",
      "#6BC8CB",
      "#C58857",
      "#712932",
      "#ACE3E9",
      "#B1D193",
      "#294260",
      "#49ACDB",
      "#2A75C3",
    ],
  },
];

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
      editorOptions: { compactMode, authToken, dataset, widget, theme },
    } = this.props;

    const authenticated = !!authToken && authToken.length > 0;

    return (
      <div className="widget-editor-wrapper">
        <WidgetEditor
          schemes={THEMES}
          compact={compactMode}
          disable={[]}
          datasetId={dataset}
          widgetId={widget}
          onSave={this.handleOnSave}
          authenticated={authenticated}
          application="rw"
          adapter={RwAdapter}
          theme={theme}
        />
      </div>
    );
  }
}

export default Editor;

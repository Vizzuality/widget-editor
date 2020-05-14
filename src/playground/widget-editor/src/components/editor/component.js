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
  handleOnSave(diff) {
    const formatSavedJson = JSON.stringify(diff, null, 2);
    const x = window.open();
    x.document.open();
    x.document.write(
      "<html><body><pre>" + formatSavedJson + "</pre></body></html>"
    );
    x.document.close();
  }

  render() {
    const {
      editorOptions: { compactMode, dataset, widget, theme },
    } = this.props;

    return (
      <div className="widget-editor-wrapper">
        <WidgetEditor
          schemes={THEMES}
          compact={compactMode}
          disable={[]}
          datasetId="852f2275-91a8-4500-9f10-89880dc53f22"
          widgetId="5a929bd2-8aeb-491d-8814-05d6f9519534"
          onSave={this.handleOnSave}
          authenticated={true}
          application="rw"
          adapter={RwAdapter}
          theme={theme}
        />
      </div>
    );
  }
}

export default Editor;

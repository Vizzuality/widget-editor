import React from "react";

import RwAdapter from "@widget-editor/rw-adapter";
import WidgetEditor from "@widget-editor/widget-editor";

const SCHEMES = [
  {
    name: "default",
    mainColor: "#3BB2D0",
    category: [
      '#3BB2D0',
      '#2C75B0',
      '#FAB72E',
      '#EF4848',
      '#65B60D',
      '#C32D7B',
      '#F577B9',
      '#5FD2B8',
      '#F1800F',
      '#9F1C00',
      '#A5E9E3',
      '#B9D765',
      '#393F44',
      '#CACCD0',
      '#717171',
    ],
  },
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
          schemes={SCHEMES}
          compact={compactMode}
          datasetId={dataset}
          widgetId={widget}
          onSave={this.handleOnSave}
          authenticated={true}
          application="rw"
          adapter={RwAdapter}
          theme={theme}
          disable={['typography']}
        />
      </div>
    );
  }
}

export default Editor;

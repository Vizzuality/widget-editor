import React from "react";
import { useSelector } from 'react-redux'

import RwAdapter from "@widget-editor/rw-adapter";
import WidgetEditor from "@widget-editor/widget-editor";

import PlaygroundRenderer from 'components/playground-renderer';

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

const Editor = () => {
  const {
    compactMode,
    dataset,
    widget,
    theme,
    areaIntersection
  } = useSelector(state => state.editorOptions);
  const renderer = useSelector(state => state.editorOptions.renderer);
  const unmounted = useSelector(state => state.editorOptions.unmounted);

  const handleOnSave = diff => {
    const formatSavedJson = JSON.stringify(diff, null, 2);
    const x = window.open();
    x.document.open();
    x.document.write(
      "<html><body><pre>" + formatSavedJson + "</pre></body></html>"
    );
    x.document.close();
  }

  if (!dataset) {
    return <p className="generic-playground-errror">Please select a dataset</p>;
  }

  if (unmounted) {
    return (
      <div className="c-unmounted">
        <p>Editor is unmounted.</p>
        <span>Redux dev tools wont show updates, so if you need to debug redux you need to refresh your browser. But in this context you can make sure that the editor does not crash and cancels all necessary events when un-mounting the editor.</span>
      </div>
    )
  }

  return (
    <>
      {renderer && <PlaygroundRenderer />}
      <div className={`widget-editor-wrapper ${renderer ? '-hidden' : ''}`}>
        <WidgetEditor
          schemes={SCHEMES}
          compact={compactMode}
          datasetId={dataset}
          widgetId={widget}
          mapboxToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onSave={handleOnSave}
          areaIntersection={areaIntersection}
          authenticated={true}
          application="rw"
          adapter={RwAdapter}
          theme={theme}
          disable={['typography']}
        />
      </div>
    </>
  );

};

export default Editor;

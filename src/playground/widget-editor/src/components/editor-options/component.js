import React from "react";

import "./styles.css";

class EditorOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      widgets: [],
    };

    const widgetEndpoint = `https://api.resourcewatch.org/v1/widget?includes=metadata,user,vocabulary`;
    fetch(widgetEndpoint)
      .then((response) => response.json())
      .then((widgetPayload) => {
        this.setState({ widgets: widgetPayload.data });
      });
  }

  render() {
    const { widgets } = this.state;
    const {
      editorOptions: {
        compactMode,
        authToken,
        dataset,
        widget,
        optionsOpen,
        theme,
      },
      modifyOptions,
    } = this.props;

    const clx = `c-playground-options ${optionsOpen ? "-open" : ""}`;

    return (
      <div className={clx}>
        <h4>Widget editor options</h4>
        <label htmlFor="token">Auth token</label>
        <input
          id="token"
          type="text"
          placeholder="Bearer token"
          value={authToken}
          onChange={(e) => modifyOptions({ authToken: e.target.value })}
        />
        <label htmlFor="dataset">Active Dataset</label>
        <select
          id="dataset"
          value={dataset}
          onChange={(e) =>
            modifyOptions({ widget: null, dataset: e.target.value })
          }
        >
          <option value="aeb0afc3-b5f2-4018-98fa-127ccb29e139">
            MAP LAYER 1
          </option>
          <option value="f8d3e79c-c3d0-4f9a-9b68-9c5ad1f025e4">
            MAP LAYER 2
          </option>
          <option value="266ed113-396c-4c69-885a-ead30df95810">
            MAP LAYER 3
          </option>
          <option value="0e565ddf-74fd-4f90-a6b8-c89d747a89ab">
            MAP LAYER 4
          </option>
          <option value="03bfb30e-829f-4299-bab9-b2be1b66b5d4">
            Forest Sector Economic Contribution
          </option>
          <option value="1ad53858-f5da-47cb-8006-5b4aa5aad589">
            Countries lacking access to electricity (urban)
          </option>
          <option value="20cc5eca-8c63-4c41-8e8e-134dcf1e6d76">Fires</option>
          <option value="a86d906d-9862-4783-9e30-cdb68cd808b8">
            Global Power Plant Database
          </option>
          <option value="ed1544bb-a092-424e-88c2-8d548f4ef94a">
            Biomes
          </option>
          <option value="1bc94710-d7ec-46f9-aa27-edddd87b1625">
            Cold Water Corals
          </option>
          <option value="c56ee507-9a3b-41d3-90ac-1406bee32c32">
            Raster only dataset (Fire risk index)
          </option>
          <option value="47da0793-f248-4882-b913-40d84be96e05">
            Stacked bar example
          </option>
          <option value="b8a6a6ea-7d2f-4d59-bb5e-7143a2ddc1fe">
            Advanced editor widget
          </option>
          <option value="ae7227d1-8779-4ca4-a2ce-3c87d53c63f6">
            cit.003.a.nrt Air Quality - Station Measurements (PM 2.5)
          </option>
        </select>

        <label htmlFor="widget">Select widget</label>
        <select
          id="widget"
          value={!!widget ? widget : "NO_WIDGET_SELECTED"}
          onChange={(e) => {
            if (e.target.value === "NO_WIDGET_SELECTED") {
              modifyOptions({
                widget: null,
                dataset: "d446a52e-c4c1-4e74-ae30-3204620a0365",
              });
            } else {
              modifyOptions({
                dataset: widgets.find((w) => w.id === e.target.value).attributes
                  .dataset,
                widget: e.target.value,
              });
            }
          }}
        >
          <option value="NO_WIDGET_SELECTED">-</option>
          {widgets.map((rwWidget) => {
            return (
              <option key={rwWidget.id} value={rwWidget.id}>
                {rwWidget.attributes.name}
              </option>
            );
          })}
        </select>

        <label htmlFor="editor-compact-mode">Toggle Compact mode</label>
        <button onClick={() => modifyOptions({ compactMode: !compactMode })}>
          {compactMode ? "Set Default mode" : "Set Compact mode"}
        </button>

        <label htmlFor="theme-color">
          <span
            className="color-presentation"
            style={{ background: theme.color }}
          />{" "}
          THEME - Color
        </label>
        <input
          id="theme-color"
          type="text"
          placeholder="#00000"
          value={theme.color}
          onChange={(e) =>
            modifyOptions({ theme: { ...theme, color: e.target.value } })
          }
        />
      </div>
    );
  }
}

export default EditorOptions;


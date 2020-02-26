import React, { Fragment } from "react";

import "./styles.css";

class EditorOptions extends React.Component {
  render() {
    const {
      editorOptions: { authToken, dataset, optionsOpen, theme },
      modifyOptions
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
          onChange={e => modifyOptions({ authToken: e.target.value })}
        />
        <label htmlFor="dataset">Active Dataset</label>
        <select
          id="dataset"
          value={dataset}
          onChange={e => modifyOptions({ dataset: e.target.value })}
        >
          <option value="03bfb30e-829f-4299-bab9-b2be1b66b5d4">
            Forest Sector Economic Contribution
          </option>
          <option value="a86d906d-9862-4783-9e30-cdb68cd808b8">
            Global Power Plant Database
          </option>
        </select>

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
          onChange={e =>
            modifyOptions({ theme: { ...theme, color: e.target.value } })
          }
        />
      </div>
    );
  }
}

export default EditorOptions;

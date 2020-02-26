import React, { Fragment } from "react";

class EditorOptions extends React.Component {
  render() {
    const {
      sampleModule: { authToken, dataset },
      setAuthToken,
      setDataset
    } = this.props;
    return (
      <Fragment>
        <input
          type="text"
          placeholder="Bearer token"
          value={authToken}
          onChange={e => setAuthToken(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dataset"
          value={dataset}
          onChange={e => setDataset(e.target.value)}
        />
      </Fragment>
    );
  }
}

export default EditorOptions;

import React, { Fragment } from "react";

import { redux } from "@widget-editor/shared";

// Components
import RendererComponent from "./component";

import GlobalStyle from "./global-style";

const Component = (props) => {
  return (
    <Fragment>
      <GlobalStyle />
      <RendererComponent {...props} />
    </Fragment>
  );
};

export default redux.connectState((state) => ({
  editor: state.editor,
  widget: state.widget,
  configuration: state.configuration,
  compact: state.theme.compact.isCompact || state.theme.compact.forceCompact,
}))(Component);

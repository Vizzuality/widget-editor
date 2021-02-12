import React, { Fragment } from "react";

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

export default Component;

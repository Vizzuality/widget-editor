import React from "react";
import styled from "styled-components";

import { FOOTER_HEIGHT, DEFAULT_BORDER } from "style-constants";

const StyledContainer = styled.div`
  height: calc(100% - ${FOOTER_HEIGHT});
  flex: 1;
  ${DEFAULT_BORDER()}
`;

const Renderer = () => {
  return <StyledContainer>Im a renderer</StyledContainer>;
};

export default Renderer;

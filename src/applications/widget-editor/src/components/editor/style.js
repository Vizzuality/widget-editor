import styled, { css } from "styled-components";
import { FOOTER_HEIGHT } from "@widget-editor/shared/lib/styles/style-constants";

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 1060px;

  * {
    box-sizing: border-box;
  }

  ${(props) =>
    props.isCompact || props.forceCompact
      ? css`
          box-sizing: border-box;
          position: relative;
          margin: 0 auto;
          height: calc(100% - ${FOOTER_HEIGHT});
        `
      : css`
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          flex-flow: column;
          @media only screen and (min-width: 768px) {
            flex-flow: wrap;
          }
        `}
`;

export const StyleEditorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
`;

export const StyledRendererContainer = styled.div`
  flex-basis: 520px;
  max-width: 520px;
  flex-shrink: 1;
  height: 100%;
`;

export const StyledOptionsContainer = styled.div`
  flex-basis: 540px;
  max-width: 540px;
  height: 100%;
`;

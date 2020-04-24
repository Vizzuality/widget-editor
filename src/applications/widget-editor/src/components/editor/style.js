import styled, { css } from "styled-components";
import { FOOTER_HEIGHT } from "@widget-editor/shared/lib/styles/style-constants";

export const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 740px;
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
  height: 660px;
`;

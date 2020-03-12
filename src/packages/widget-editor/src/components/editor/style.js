import styled, { css } from "styled-components";
import { FOOTER_HEIGHT } from "style-constants";

export const StyledContainer = styled.div`
  width: 100%;
  box-sizing: border-box;

  ${props =>
    props.isCompact
      ? css`
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          height: calc(100% - ${FOOTER_HEIGHT});
        `
      : css`
          height: 100%;
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          flex-flow: column;
          @media only screen and (min-width: 768px) {
            flex-flow: wrap;
          }
        `}
`;

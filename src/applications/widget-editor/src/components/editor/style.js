import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1060px;

  * {
    box-sizing: border-box;
  }

  ${props => props.isCompact || props.forceCompact
    ? css`
        max-width: 520px;
      `
    : null
  }
`;

export const StyleEditorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
`;

export const StyledRendererContainer = styled.div`
  flex-basis: 520px;
  max-width: calc((100% - 20px) / 2);
  flex-shrink: 1;
  height: 100%;
`;

export const StyledOptionsContainer = styled.div`
  flex-basis: calc((100% - 20px) / 2 + 20px);
  max-width: calc((100% - 20px) / 2 + 20px);
  height: 100%;

  ${props => props.isCompact  || props.forceCompact
    ? css`
        position: absolute;
        top: 65px;
        left: 1px;
        width: calc(100% - 2px);
        height: calc(500px - 66px);
        visibility: hidden;
        background: white;

        ${props => props.isOpen && css`
          z-index: 2;
          visibility: visible;
        `}
      `
    : null
  }
`;

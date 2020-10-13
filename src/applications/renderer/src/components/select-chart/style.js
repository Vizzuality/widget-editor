import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  margin: 10px;
  ${(props) =>
    (props.isCompact || props.forceCompact) &&
    css`
      display: flex;
      align-items: center;
    `}
`;

export const StyledSelectBox = styled.div`
  ${(props) =>
    (props.isCompact || props.forceCompact) &&
    css`
      width: 100%;
      padding-right: 15px;
    `}
`;

export const StyledOverflow = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 10;
`;
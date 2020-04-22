import styled, { css } from "styled-components";

export const StyledDropdownBox = styled.div`
  flex: 0 0 30%;
`;

export const StyledColorsBoxContainer = styled.div`
  flex: 0 0 70%;

  ${(props) =>
    props.alignCenter &&
    css`
      align-items: center;
      display: flex;
    `}

  ${(props) =>
    props.overflowIsHidden &&
    css`
      max-height: 70px;
      overflow-y: scroll;
    `}
`;

export const StyledColorsBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #717171;
  ${(props) =>
    props.alignCenter &&
    css`
      float: left;
      width: 110px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin: 5px;
      padding-left: 20px;
      position: relative;
      > span {
        position: absolute;
        left: 0;
      }
    `}
`;

export const StyledColorDot = styled.span`
  ${(props) =>
    props.color &&
    css`
      background: ${props.color};
    `}

  width: 14px;
  height: 14px;
  display: block;
  border-radius: 14px;
  margin: 0 5px 0 0;
`;

export const StyledContainer = styled.div`
  box-sizing: border-box;
  border-top: 1px solid #d7d7d7;
  width: 100%;
  min-height: 55px;
  padding: 15px 36px;
  display: flex;
  justify-content: space-between;

  ${(props) =>
    !props.compact &&
    css`
      position: absolute;
      bottom: 0;
    `}

  * {
    box-sizing: border-box;
    outline: 0;
  }
`;

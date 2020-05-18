import styled, { css } from "styled-components";

export const ChartNeedsOptions = styled.h4`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-57%, -50%);
  color: #bdbdbd;
`;

export const StyledContainer = styled.div`
  ${(props) =>
    !props.standalone &&
    css`
      position: relative;
      flex-grow: 1;
      flex: 1;
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
    `}

  ${(props) =>
    (props.standalone || props.thumbnail) &&
    css`
      width: 100%;
      height: auto;
    `}


  ${(props) =>
    props.compact &&
    css`
      padding-bottom: 50px;
    `}

  .c-chart {
    width: 100%;
    height: 100%;
    background-position: 50%;
    background-size: cover;

    ${(props) =>
      !props.standalone &&
      css`
        max-height: 400px;
      `}

    ${(props) =>
      props.compact &&
      css`
        height: 400px;
      `}
  }
`;

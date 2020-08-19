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
      padding: 20px 20px 55px 50px;
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
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-position: 50%;
    background-size: cover;

    .vega-bindings {
      flex-shrink: 0;

      .vega-bind {
        display: block;
        margin-top: 10px;
        font-size: 14px;

        label {
          display: flex;
          justify-content: start;
          align-items: center;

          span {
            display: inline-block;

            &:first-of-type {
              min-width: 140px;
              margin-right: 10px;
            }

            &:last-of-type:not(:first-of-type) {
              margin-left: 10px;
            }
          }
        }
      }
    }

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

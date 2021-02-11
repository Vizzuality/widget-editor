import styled from "styled-components";

export const StyledContainer = styled.div`
  width: 100%;
  height: auto;

  .c-chart {
    flex-basis: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
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
  }
`;

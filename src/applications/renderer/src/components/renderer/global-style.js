import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  .vg-tooltip {
    visibility: hidden;
    position: fixed;
    z-index: 2000;
    padding: 15px;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid rgba(26, 28, 34, 0.1);
    box-shadow: 0 20px 30px 0 rgba(0, 0, 0, .1);
    font-size: 14px;
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans;;
    color: #393f44;

    tr {
      td.key {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px;
        color: #808080;
      }

      td.value {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 700;
      }

      &:first-of-type {
        td.value {
          font-size: 18px;
        }
      }
    }
  }
`;

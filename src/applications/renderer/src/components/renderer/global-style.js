import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  #vg-tooltip-element.vg-tooltip {
    padding: 15px;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid rgba(26, 28, 34, 0.1);
    box-shadow: 0 20px 30px 0 rgba(0, 0, 0, .1);
    font-size: 14px;
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans;;
    color: #393f44;

    tr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      td.key {
        width: 140px;
        color: #808080;
        max-width: 150px;
        font-size: 14px;
        text-align: left;
      }

      td.value {
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

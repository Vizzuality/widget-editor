import { createGlobalStyle } from "styled-components";
import "vega-tooltip/build/vega-tooltip.min.css";

export default createGlobalStyle`
  // We increase the specificity to override the default styles
  div.vg-tooltip.light-theme {
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
        padding-right: 20px;
        text-align: left;
        color: #808080;
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

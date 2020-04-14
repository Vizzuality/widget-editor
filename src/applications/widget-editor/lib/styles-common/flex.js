import styled from "styled-components";
const FlexContainer = styled.div.withConfig({
  displayName: "flex__FlexContainer",
  componentId: "sc-1h9qo2v-0"
})(["display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;flex-flow:", ";width:100%;", " label{flex-basis:100%;}"], props => props.row ? "row" : "column", props => props.row ? `> * { padding-right: 20px; &:last-child { padding-right: 0; } } ` : "");
export default FlexContainer;
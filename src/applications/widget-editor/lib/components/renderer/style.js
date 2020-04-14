import styled from 'styled-components';
import { FOOTER_HEIGHT, DEFAULT_BORDER } from "../../style-constants";
export const StyledContainer = styled.div.withConfig({
  displayName: "style__StyledContainer",
  componentId: "sc-1qafyg5-0"
})(["position:relative;display:flex;flex-flow:column;height:calc(100% - ", ");background:#fff;flex:1;width:100%;", ""], FOOTER_HEIGHT, DEFAULT_BORDER());
export const RestoringWidget = styled.div.withConfig({
  displayName: "style__RestoringWidget",
  componentId: "sc-1qafyg5-1"
})(["height:300px;display:flex;align-items:center;justify-content:center;"]);
export const RestoringWidgetTitle = styled.h4.withConfig({
  displayName: "style__RestoringWidgetTitle",
  componentId: "sc-1qafyg5-2"
})(["color:#a9a9a9;font-size:21px;"]);
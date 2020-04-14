import styled from "styled-components";
export const StyledAccordion = styled.div.withConfig({
  displayName: "style__StyledAccordion",
  componentId: "sc-16hbm2j-0"
})(["width:100%;padding-top:24px;padding-bottom:24px;"]);
export const StyledAccordionContent = styled.div.withConfig({
  displayName: "style__StyledAccordionContent",
  componentId: "sc-16hbm2j-1"
})(["display:\"block\";max-height:", ";overflow-y:", ";transition:all 0.2s ease-out;padding-left:24px;padding-top:", ";padding-bottom:", ";"], props => props.scrollHeight + "px" || "0", props => props.scrollHeight ? "visible" : "hidden", props => props.scrollHeight ? "18px" : "0" || "0", props => props.scrollHeight ? "18px" : "0" || "0");
export const StyledAccordionButton = styled.a.withConfig({
  displayName: "style__StyledAccordionButton",
  componentId: "sc-16hbm2j-2"
})(["display:block;height:25px;color:#393f44;font-size:16px;font-weight:bold;line-height:25px;position:relative;padding-left:25px;cursor:pointer;&:before{content:\" \";width:10px;height:10px;border-radius:50%;background:#c32d7b;position:absolute;left:0;top:8px;}"]);
export const StyledAccordionSection = styled.div.withConfig({
  displayName: "style__StyledAccordionSection",
  componentId: "sc-16hbm2j-3"
})(["padding-top:11px;padding-bottom:11px;position:relative;&:before{content:\" \";height:1px;width:calc(100% - 24px);display:block;position:absolute;top:0;background-color:#d2d3d6;margin-left:24px;}&:first-child{&:before{display:none;}}"]);
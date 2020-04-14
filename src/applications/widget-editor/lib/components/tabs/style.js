import styled from 'styled-components';
export const StyledTabsContainer = styled.div.withConfig({
  displayName: "style__StyledTabsContainer",
  componentId: "sc-1g0bxql-0"
})(["position:relative;height:100%;"]);
export const StyledTabsContentBox = styled.div.withConfig({
  displayName: "style__StyledTabsContentBox",
  componentId: "sc-1g0bxql-1"
})(["overflow-y:auto;height:calc(100% - 80px);padding-right:30px;::-webkit-scrollbar{width:7px;}::-webkit-scrollbar-track{box-shadow:inset 0 0 2px grey;border-radius:10px;background:rgba(0,0,0,0.05);}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.3);border-radius:10px;}::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.4);}"]);
export const StyledTabsContent = styled.div.withConfig({
  displayName: "style__StyledTabsContent",
  componentId: "sc-1g0bxql-2"
})(["display:", ";"], props => props.active ? 'block' : 'none');
export const StyledList = styled.ul.withConfig({
  displayName: "style__StyledList",
  componentId: "sc-1g0bxql-3"
})(["display:flex;justify-content:space-between;padding:20px 30px 20px 0;list-style:none;"]);
export const StyledListLabel = styled.li.withConfig({
  displayName: "style__StyledListLabel",
  componentId: "sc-1g0bxql-4"
})(["color:red;padding-right:5px;padding-left:5px;&:first-child{padding-left:0;}&:last-child{padding-right:0;}"]);
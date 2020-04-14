import styled from 'styled-components';
export const StyledTableBox = styled.div.withConfig({
  displayName: "style__StyledTableBox",
  componentId: "nb03xp-0"
})(["width:100%;height:100%;overflow:auto;"]);
export const StyledTable = styled.table.withConfig({
  displayName: "style__StyledTable",
  componentId: "nb03xp-1"
})(["border-collapse:separate;border-spacing:0;width:100%;padding:0;border-radius:4px;overflow:hidden;border:1px solid rgba(26,28,34,.1);font-size:14px;margin-bottom:20px;"]);
export const StyledTr = styled.tr.withConfig({
  displayName: "style__StyledTr",
  componentId: "nb03xp-2"
})(["background-color:#fff;box-sizing:border-box;"]);
export const StyledTd = styled.td.withConfig({
  displayName: "style__StyledTd",
  componentId: "nb03xp-3"
})(["width:100%;padding:20px;text-align:", ";"], props => props.center ? 'center' : 'left');
export const StyledTh = styled.td.withConfig({
  displayName: "style__StyledTh",
  componentId: "nb03xp-4"
})(["position:relative;font-size:14px;color:#393f44;font-weight:700;white-space:nowrap;padding:20px;"]);
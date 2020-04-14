import styled from "styled-components";
export const StyledSelectOptionTitle = styled.div.withConfig({
  displayName: "style__StyledSelectOptionTitle",
  componentId: "sc-42eb37-0"
})(["font-size:14px;display:flex;align-items:center;font-weight:500;"]);
export const StyledSelectOptionDescription = styled.div.withConfig({
  displayName: "style__StyledSelectOptionDescription",
  componentId: "sc-42eb37-1"
})(["font-size:12px;padding-top:10px;"]);
export const StyledSelectOption = styled.div.withConfig({
  displayName: "style__StyledSelectOption",
  componentId: "sc-42eb37-2"
})(["padding:10px 20px;border-bottom:1px solid #6f6f6f;color:", ";&:hover{background-color:blue;cursor:pointer;color:white;}&:last-child{border-bottom:none;}"], props => props.isDisabled ? "#eaeaea" : "#6f6f6f" || "#6f6f6f");
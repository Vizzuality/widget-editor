import styled, { css } from "styled-components";
export const StyledDropdownBox = styled.div.withConfig({
  displayName: "style__StyledDropdownBox",
  componentId: "sc-10sjti7-0"
})(["flex:0 0 30%;"]);
export const StyledColorsBoxContainer = styled.div.withConfig({
  displayName: "style__StyledColorsBoxContainer",
  componentId: "sc-10sjti7-1"
})(["flex:0 0 70%;", " ", ""], props => props.alignCenter && css(["align-items:center;display:flex;"]), props => props.overflowIsHidden && css(["max-height:70px;overflow-y:scroll;"]));
export const StyledColorsBox = styled.div.withConfig({
  displayName: "style__StyledColorsBox",
  componentId: "sc-10sjti7-2"
})(["display:flex;align-items:center;font-size:14px;color:#717171;", ""], props => props.alignCenter && css(["float:left;width:110px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin:5px;padding-left:20px;position:relative;> span{position:absolute;left:0;}"]));
export const StyledColorDot = styled.span.withConfig({
  displayName: "style__StyledColorDot",
  componentId: "sc-10sjti7-3"
})(["", " width:14px;height:14px;display:block;border-radius:14px;margin:0 5px 0 0;"], props => props.color && css(["background:", ";"], props.color));
export const StyledContainer = styled.div.withConfig({
  displayName: "style__StyledContainer",
  componentId: "sc-10sjti7-4"
})(["box-sizing:border-box;border-top:1px solid #d7d7d7;position:absolute;bottom:0;left:0;width:100%;min-height:55px;padding:15px 36px;display:flex;justify-content:space-between;*{box-sizing:border-box;outline:0;}"]);
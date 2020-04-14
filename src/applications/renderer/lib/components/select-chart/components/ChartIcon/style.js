import styled, { css } from 'styled-components';
export const StyledBox = styled.div.withConfig({
  displayName: "style__StyledBox",
  componentId: "sc-1libi66-0"
})(["box-sizing:border-box;padding:7px 8px;width:50%;"]);
export const StyledIcon = styled.div.withConfig({
  displayName: "style__StyledIcon",
  componentId: "sc-1libi66-1"
})(["box-sizing:border-box;height:51px;width:100%;border:", ";border-radius:4px;background-color:#F7F7F7;display:flex;align-items:center;justify-content:center;text-align:center;opacity:", ";pointer-events:", ";&:hover{border:2px solid #C32D7B;}"], props => props.active ? '2px solid #C32D7B' : '1px solid #E6E6E6', props => props.disabled ? '0.2' : '1', props => props.disabled ? 'none' : 'auto');
import styled from "styled-components";

export const StyledMap = styled.div`
  height: 100%;
  width: 100%;
  z-index: 1;
`;

export const StyledLegend = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
  transform: translate(-15px, -30px);
  width: 310px;
  min-height: 40px;
`;

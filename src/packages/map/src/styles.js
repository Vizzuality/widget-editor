import styled, { css } from "styled-components";

export const StyledMapContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 380px;
  .map-leaflet {
    z-index: 1;
    display: flex;
    height: 100%;
    width: 100%;
  }
`;

export const StyledCaption = styled.p`
  position: absolute;
  z-index: 2;
  color: #fff;
  font-size: 21px;
  transform: translate(15px, 15px);
  max-width: 85%;
`;

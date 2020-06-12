import styled, { css } from "styled-components";

export const StyledMapContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: inherit;
  .map-leaflet {
    z-index: 1;
    display: flex;
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

export const StyledLegend = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 0;
  right: 0;
  background: #fff;
  transform: translate(-15px, -30px);
  width: 310px;
  min-height: 40px;
  border-radius: 5px 0 5px 5px;
`;

export const StyledLegendTitle = styled.h5`
  color: #393f44;
  font-size: 14px;
  padding: 10px;
`;

export const StyledLegendLayerWrapper = styled.div`
  max-height: 140px;
  overflow-y: scroll;
`;

export const StyledLegendConfig = styled.div`
  color: red;
`;

export const StyledLegendConfigItem = styled.div`
  color: #393f44;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
`;

export const StyledConfigItemColor = styled.span`
  display: block;
  margin: 0 5px 0 0;
  width: 12px;
  height: 12px;
  ${(props) =>
    props.hexCode &&
    css`
      background: ${props.hexCode};
    `}
`;

export const StyledClosedLegend = styled.h5`
  color: #393f44;
  font-size: 11px;
  text-transform: uppercase;
  line-height: 40px;
  padding: 0 10px;
`;

export const StyledLegendToggle = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: hsla(0, 0%, 44.3%, 0.8);
  width: 40px;
  height: 32px;
  top: -32px;
  border: none;
  outline: none;
  right: 0;
  border-radius: 5px 5px 0 0;

  ${(props) =>
    !props.legendOpen &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}

  svg {
    fill: #fff;
    width: 14px;
    height: 14px;
  }
`;

export const StyledGradient = styled.div`
  ${(props) =>
    props.items &&
    css`
      background: linear-gradient(90deg, ${props.items.join(",")});
    `}
  height: 7px;
  width: calc(100% - 20px);
  margin: 0 10px 7px 10px;
  box-sizing: border-box;
`;

export const StyledGradientUnits = styled.div`
  position: relative;
  height: 20px;
  display: flex;
  justify-content: space-between;
  > div:first-child {
    text-align: left;
  }
  > div:last-child {
    text-align: right;
  }
`;

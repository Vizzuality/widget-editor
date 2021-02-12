import styled from "styled-components";
import { DEFAULT_BORDER } from "@widget-editor/shared/lib/styles/style-constants";

export const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
  background: #fff;

  ${DEFAULT_BORDER()}
`;

export const RestoringWidget = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RestoringWidgetTitle = styled.h4`
  color: #a9a9a9;
  font-size: 21px;
`;

export const StyledChartTitle = styled.h3`
  flex-shrink: 0;
  padding: 5px 0 0 0;
  color: #393F44;
  font-size: 16px;
  text-align: center;
`;

export const StyledMapTitle = styled.h3`
  position: absolute;
  z-index: 2;
  color: #fff;
  font-size: 21px;
  transform: translate(15px, 15px);
  max-width: 85%;
`;

export const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-weight: 700;
  color: #bdbdbd;
`;

export const StyledChartContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px 10px 55px ${props => props.hasYAxis && !props.advanced ? '60px' : '10px'};

  .c-renderer {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export const StyledMapContainer = styled.div`
  position: relative;
  height: 100%;
`;
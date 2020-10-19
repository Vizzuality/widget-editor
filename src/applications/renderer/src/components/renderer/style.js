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
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RestoringWidgetTitle = styled.h4`
  color: #a9a9a9;
  font-size: 21px;
`;

import styled from "styled-components";
import {
  FOOTER_HEIGHT,
  DEFAULT_BORDER,
} from "@packages/shared/lib/styles/style-constants";

export const StyledContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  height: calc(100% - ${FOOTER_HEIGHT});
  background: #fff;
  flex: 1;
  width: 100%;
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
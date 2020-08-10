import styled from 'styled-components';

import { Button } from "@widget-editor/shared";

export const CalloutButton = styled(Button)`
  margin-top: 10px;
`;

export const CalloutLinkButton = styled(Button)`
  margin-top: 10px;
  padding: 0;
  border: none;
  font-size: inherit;
  color: ${props => props.themeColor};

  &:hover:not([disabled]) {
    border: none;
  }
`;
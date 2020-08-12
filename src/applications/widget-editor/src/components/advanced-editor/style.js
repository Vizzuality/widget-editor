import styled from 'styled-components';
import tinycolor from 'tinycolor2';

import { Button } from "@widget-editor/shared";
import { StyledCallout } from "components/callout/style";

export const Container = styled.div`
  label {
    margin-top: 20px;
  }
`;

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

export const ValidationCallout = styled(StyledCallout)`
  margin-top: 20px;
  border: 1px solid #ff4141;
  border-radius: 4px;
  background-color: ${props => tinycolor('#ff4141').setAlpha(0.05).toRgbString()};

  ul {
    padding-left: 1em;

    li {
      margin-top: 5px;
    }
  }
`;

export const InfoCallout = styled(StyledCallout)`
  margin-top: 20px;
  padding: 0;
  border: none;
  background: none;

  a {
    text-decoration: underline;
    color: inherit;
  }
`;
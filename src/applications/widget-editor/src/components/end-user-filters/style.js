import styled from 'styled-components';
import { StyledCallout } from 'components/callout/style';

export const InfoCallout = styled(StyledCallout)`
  margin-bottom: 20px;
  padding: 0;
  border: none;
  background: none;

  a {
    text-decoration: underline;
    color: inherit;
  }
`;
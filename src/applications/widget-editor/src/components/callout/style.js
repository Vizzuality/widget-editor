import styled from 'styled-components';
import tinycolor from 'tinycolor2';

export const StyledCallout = styled.div`
  padding: 15px;
  font-size: 14px;
  border: 1px solid ${props => props.themeColor};
  border-radius: 4px;
  background-color: ${props => tinycolor(props.themeColor).setAlpha(0.05).toRgbString()};

  p {
    margin-bottom: 5px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;
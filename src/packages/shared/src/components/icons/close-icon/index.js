import React from 'react';
import styled from 'styled-components';

const Icon = styled.svg`
  &:hover {
    path {
      fill: ${props => (props.hoverColor ? props.hoverColor : '#C32D7B') || 'auto'};
    }
  }
`;

const CloseIcon = (props) => (
  <Icon {...props} viewBox="0 0 32 32">
    <title>Close</title>
    <path d="M16 11.636l-11.636-11.636-4.364 4.364 11.636 11.636-11.636 11.636 4.364 4.364 11.636-11.636 11.636 11.636 4.364-4.364-11.636-11.636 11.636-11.636-4.364-4.364z"></path>
  </Icon>
);

export default CloseIcon;
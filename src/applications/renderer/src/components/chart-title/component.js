import React from 'react';

import { StyledTitle } from './style';

const ChartTitle = ({ configuration }) => {
  return <StyledTitle>{configuration.title}</StyledTitle>
}

export default ChartTitle;

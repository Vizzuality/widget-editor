import React from 'react';

import { configuration as ConfigurationType } from '@widget-editor/types/js-types';

import { StyledTitle } from './style';

const ChartTitle = ({ configuration }) => {
  return <StyledTitle>{configuration.title}</StyledTitle>
}

ChartTitle.propTypes = {
  configuration: ConfigurationType
}

export default ChartTitle;

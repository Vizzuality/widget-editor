import React from 'react';

import { JSTypes } from "@widget-editor/types";

import { StyledTitle } from './style';

const ChartTitle = ({ configuration }) => {
  return <StyledTitle>{configuration.title}</StyledTitle>
}

ChartTitle.propTypes = {
  configuration: JSTypes.configuration
}

export default ChartTitle;

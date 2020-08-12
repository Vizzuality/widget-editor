import React from 'react';
import PropTypes from 'prop-types';

import { StyledCallout } from './style';

const Callout = ({ themeColor, children }) => (
  <StyledCallout themeColor={themeColor}>
    {children}
  </StyledCallout>
);

Callout.propTypes = {
  themeColor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Callout;
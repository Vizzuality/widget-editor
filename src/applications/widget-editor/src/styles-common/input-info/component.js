import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const InputInfo = ({ id, ...rest }) => <div id={id} {...rest} />;

InputInfo.propTypes = {
  id: PropTypes.string.isRequired,
};

export default styled(InputInfo)`
  line-height: 1.5em;
  margin: 5px 0 0 0;
  color: #717171;
  font-size: 14px;

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

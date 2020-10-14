import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Checkbox = ({ id, label, checked, onChange, className, ...rest }) => (
  <div className={className}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      {...rest}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  checked: false,
  onChange: () => null,
};

export default styled(Checkbox)`
  input {
    position: absolute;
    left: 0;
    top: 1px;
    height: 16px;
    width: 16px;
    opacity: 0;

    &:focus,
    &:active {
      & + label {
        &:before {
          border-color: #c32d7b;
        }
      }
    }

    &:disabled {
      & + label {
        color: #999999;

        &:before,
        &:after {
          border-color: rgba(202,204,208,0.34);
        }
      }
    }

    &:checked + label:after {
      content: "";
    }
  }
  
  label {
    position: relative;
    display: inline-block;
    padding-left: 22px;
    font-size: 16px;
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans;
    color: #393f44;
  }

  label:before,
  label:after {
    position: absolute;
    display: inline-block;
  }

  label:before {
    top: 1px;
    left: 0px;
    height: 16px;
    width: 16px;
    border: 1px solid rgba(202, 204, 208, 0.85);
    border-radius: 4px;
    background: white;
    content: "";
  }

  label:after {
    top: 6px;
    left: 5px;
    height: 3px;
    width: 6px;
    border-left: 2px solid #2C75B0;
    border-bottom: 2px solid #2C75B0;
    transform: rotate(-45deg);
  }
`;
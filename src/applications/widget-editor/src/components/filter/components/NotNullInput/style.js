import styled from "styled-components";

export const StyledCheckbox = styled.div`
  color: #393f44;
  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
  }

  label {
    cursor: pointer;
    position: relative;
    display: inline-block;
    padding-left: 22px;
    font-size: 14px;
  }

  label::before,
  label::after {
    position: absolute;
    content: "";
    display: inline-block;
  }

  label::before {
    height: 16px;
    width: 16px;

    border: 1px solid #3bb2d0;
    border-radius: 5px;
    left: 0px;
    top: 0;
  }

  label::after {
    height: 3px;
    width: 6px;
    border-left: 2px solid #3bb2d0;
    border-bottom: 2px solid #3bb2d0;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    left: 5px;
    top: 6px;
  }

  input[type="checkbox"] + label::after {
    content: none;
  }

  input[type="checkbox"]:checked + label::after {
    content: "";
  }

  input[type="checkbox"]:focus + label::before {
    box-shadow: 0 0 3px #3bb2d0;
  }
`;

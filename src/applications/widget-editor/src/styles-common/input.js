import styled from "styled-components";

// TODO: Move configuration to global config file.
const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 45px;
  padding: 0 10px;
  border: 1px solid rgba(202, 204, 208, 0.85);
  border-radius: 4px;
  font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans;
  font-size: 16px;
  line-height: 45px;
  color: #393f44;
  background: #ffffff;

  &::placeholder {
    color: #c5c7c8;
    opacity: 1;
  }

  &:focus,
  &:active {
    border-color: #c32d7b;
    outline: none;
  }

  &:disabled {
    color: #999999;
    border-color: rgba(202,204,208,0.34);
  }
`;

export default Input;

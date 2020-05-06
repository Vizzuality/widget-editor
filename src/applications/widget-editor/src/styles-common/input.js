import styled from "styled-components";

// TODO: Move configuration to global config file.
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 10px;

  background: #ffffff;
  border: 1px solid rgba(202, 204, 208, 0.85);
  border-radius: 4px;
  color: #393f44;
  font-size: 14px;

  &[type="number"] {
    padding: 11px 10px;
  }

  &[type="date"] {
    padding: 8px 10px;
    margin-top: 10px;
    max-width: 160px;
  }

  &.read-only {
    color: #c5c5c5;
    outline: none;
  }
`;

export default Input;

import styled from "styled-components";

// TODO: Move configuration to global config file.
const Input = styled.input`
  background: #ffffff;
  border: 1px solid rgba(202, 204, 208, 0.85);
  border-radius: 4px;
  color: #393f44;
  padding: 14px 10px;
  font-size: 14px;
  margin-left: 20px;

  &[type="number"] {
    text-align: center;
  }
`;

export default Input;

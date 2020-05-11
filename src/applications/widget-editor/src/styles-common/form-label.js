import styled, { css } from "styled-components";

const FormLabel = styled.label`
  display: block;
  padding: 0 0 10px 0;
  ${(props) =>
    props.invalid &&
    css`
      span {
        color: #ff4141;
      }
    `}
  color: #393f44;
  font-weight: 700;
  font-size: 13px;
`;

export default FormLabel;

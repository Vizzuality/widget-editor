import styled from "styled-components";

const InputGroup = styled.div`
  position: relative;
  width: 100%;

  ${props => !props.noMargins && "margin: 0 0 15px 0;"}
`;

export default InputGroup;

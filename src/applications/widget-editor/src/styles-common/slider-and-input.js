import styled from "styled-components";

const SliderAndInput = styled.div`
  display: flex;
  width: 100%;
  align-items: center;

  > div {
    flex: 1;
  }

  > input {
    width: 50px;
    flex-grow: 0;
    margin-left: 40px;
  }
`;

export default SliderAndInput;

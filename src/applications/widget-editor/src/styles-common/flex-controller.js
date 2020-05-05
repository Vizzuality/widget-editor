import styled, { css } from "styled-components";

const FlexController = styled.div`
  flex: 0 0 auto;
  width: ${(props) =>
    props.contain &&
    css`
      ${props.contain}%;
    `}};
  display: flex;
  box-sizing: border-box;
  > * {
    width: 100%;
  }
`;

export default FlexController;

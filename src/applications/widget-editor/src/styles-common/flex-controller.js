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
    width: ${(props) =>
      props.constrainElement ? `${props.constrainElement}%` : "100%"};

    ${(props) =>
      props.alignment &&
      props.alignment === "right" &&
      css`
        margin-left: auto;
      `}
  }
`;

export default FlexController;

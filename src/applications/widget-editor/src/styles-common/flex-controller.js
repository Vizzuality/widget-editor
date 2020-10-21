import styled, { css } from "styled-components";

const FlexController = styled.div`
  flex: ${props => props.grow || 0} ${props => props.shrink || 0} ${props => props.contain ? `${props.contain}%` : 'auto'}};
  display: flex;

  > * {
    ${(props) => props.constrainElement && css`
      width: ${props.constrainElement}%;
    `}

    ${(props) => props.alignment && props.alignment === "right" && css`
      margin-left: auto;
    `}
  }
`;

export default FlexController;

import styled from "styled-components";

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-flow: ${props => (props.row ? "row" : "column")};
  width: 100%;

  ${props =>
    props.row
      ? `> * { padding-right: 20px; &:last-child { padding-right: 0; } } `
      : ""}

  label {
    flex-basis: 100%;
  }
`;

export default FlexContainer;

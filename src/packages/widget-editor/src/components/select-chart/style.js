
import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  margin: 10px;
  ${props => props.isCompact && 
  css`
    display: flex;
    align-items: center;
  `}
`;

export const StyledSelectBox = styled.div`
  ${props => props.isCompact && 
  css`
    width: 100%;
    padding-right: 15px;
  `}
`;

export const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    padding: "3px 0"
  }),
  option: base => ({
    ...base
  })
};
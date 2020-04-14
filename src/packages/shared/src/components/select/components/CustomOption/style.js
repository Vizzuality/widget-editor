import styled from "styled-components";

export const StyledSelectOptionTitle = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  font-weight: 500;  
`;

export const StyledSelectOptionDescription = styled.div`
  font-size: 12px;
  padding-top: 10px;  
`;

export const StyledSelectOption = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid #6f6f6f;
  color: ${props => (props.isDisabled ? "#eaeaea" : "#6f6f6f" || "#6f6f6f")};
  &:hover {
    background-color: blue;
    cursor: pointer;
    color: white;
  }
  &:last-child {
    border-bottom: none;
  }
`;
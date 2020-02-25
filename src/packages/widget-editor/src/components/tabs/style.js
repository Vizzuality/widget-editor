import styled from 'styled-components';

export const StyledTabsContainer = styled.div`
  position: relative;
`;

export const StyledTabsContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

export const StyledList = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  list-style: none;
`;

export const StyledListLabel = styled.li`
  color: red;
  padding-right: 5px;
  padding-left: 5px;

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;
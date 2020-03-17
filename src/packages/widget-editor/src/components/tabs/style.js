import styled from 'styled-components';

export const StyledTabsContainer = styled.div`
  position: relative;
  height: 100%;
`;

export const StyledTabsContentBox = styled.div`
  overflow-y: auto;
  height: calc(100% - 80px);
  padding-right: 30px;


  /* scrollbar chrome customization */
  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px grey; 
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3); 
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background:  rgba(0, 0, 0, 0.4); 
  }
`;

export const StyledTabsContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

export const StyledList = styled.ul`
  display: flex;
  justify-content: space-between;
  padding: 20px 30px 20px 0;
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
import styled, { css } from 'styled-components';

export const StyledTabsContainer = styled.div`
  position: relative;
  height: 100%;
`;

export const StyledTabsContentBox = styled.div`
  overflow-y: auto;
  height: calc(100% - 80px);
  padding-right: 30px;

  ${(props) => (props.compact.isCompact || props.compact.forceCompact) && css`
    height: calc(100% - 65px);
    padding: 0 10px;
  `}


  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px grey; 
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.05);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3); 
    border-radius: 10px;
  }

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
  padding: 20px 30px 10px 0;
  list-style: none;

  ${(props) => (props.compact.isCompact || props.compact.forceCompact) && css`
    padding: 10px;
  `}
`;

export const StyledListLabel = styled.li`
  flex-grow: 1;
  color: red;
  margin: 0 5px 0 0;

  &:last-child {
    margin-right: 0;
  }

  button {
    width: 100%;
    text-align: center;
  }

  button[aria-pressed = "true"] {
    border-width: 2px !important;
  }

  button[aria-pressed = "false"] {
    // Prevent the change from a 1px width to a 2px width to cause a jump
    margin: 0 1px;
    width: calc(100% - 2px);
  }
`;
import styled from 'styled-components';

export const StyledModalBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.3);
  transition: all .16s cubic-bezier(.47,0,.745,.715);
  z-index: ${props => (props.isOpen ? 1100 : -1)};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledModalContainer = styled.div`
  -webkit-transition: -webkit-transform .24s cubic-bezier(.215,.61,.355,1);
  transition: -webkit-transform .24s cubic-bezier(.215,.61,.355,1);
  transition: transform .24s cubic-bezier(.215,.61,.355,1);
  transition: transform .24s cubic-bezier(.215,.61,.355,1),-webkit-transform .24s cubic-bezier(.215,.61,.355,1);
  -webkit-transform: translateY(0);
  transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-35px)')};
  display: -webkit-box;
  display: flex;
  position: relative;
  width: calc(100% - 50px);
  max-width: 880px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.15);
  z-index: 1;
`;

export const StyledModalContent = styled.div`
  position: relative;
  width: 100%;
  max-height: 85vh;
  min-height: 150px;
  overflow: auto;
  padding: 72px;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 7px 15px 0 rgba(0,0,0,.15);
`;

export const StyledModalCloseBtn = styled.button`
  fill: #000;
  display: block;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
  z-index: 2;
  outline: none;
`;

export const StyledActions = styled.div`
  padding-top: 60px;
  
`;
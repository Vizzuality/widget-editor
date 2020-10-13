import styled from 'styled-components';


export const StyledContainer = styled.div`
  padding-top: 10px;
  position: absolute;
  top: 40px;
  right: -115px;
  width: 262px;
  z-index: 11;

  @media only screen and (max-width: 767px) {
    right: 0;
  }
`;

export const StyledMenu = styled.div`
  box-sizing: border-box;
  height: auto;
  max-height: 460px;
  width: 100%;
  border: 1px solid #D7D7D7;
  border-radius: 4px;
  background-color: #FFFFFF;
  box-shadow: 0 20px 30px 0 rgba(0,0,0,0.1);
  z-index: 2;
  padding: 30px;

  &:before {
    content: ' ';
    position: absolute;
    top: -12px;
    left: 50%;
    border: 13px solid transparent;
    border-top-color: #D7D7D7;
    z-index: -1;
    transform: translateX(-50%) rotate(180deg);

    @media only screen and (max-width: 767px) {
      right: -10px;
      left: auto;
    }
  }

  &:after {
    content: ' ';
    position: absolute;
    left: 50%;
    top: -8px;
    border: 10px solid transparent;
    border-top-color: #FFFFFF;
    z-index: 3;
    transform: translateX(-50%) rotate(180deg);

    @media only screen and (max-width: 767px) {
      right: -4px;
      left: auto;
    }
  }
`;

export const StyledTitle = styled.h4`
  color: #555555;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  margin-bottom: 0;
  text-transform: uppercase;
`;

export const StyledIcons = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
`;

import styled from "styled-components";

export const StyledPopupContainer = styled.div`
  position: absolute;
  /* width: 420px; */
	box-sizing: border-box;
	/* height: 199.39px; */
	height: auto;
	width: 422px;
	border: 1px solid rgba(26,28,34,0.1);
	border-radius: 4px;
	background-color: #FFFFFF;
	box-shadow: 0 20px 30px 0 rgba(0,0,0,0.1);
  z-index: 2;
  bottom: 40px;
  left: -75px;
  padding: 20px;

  &:after {
    content: '';
    position: absolute;
    left: 200px;
    bottom: -20px;
    border: 10px solid transparent;
    border-top: 10px solid #FFFFFF;
    z-index: 3;
  }
`;
import styled from "styled-components";

export default styled.div`
  position: relative;

  input[type="color"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 100%;
    padding: 0;
    overflow: hidden; // Force the border-radius to apply in Firefox
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  input[type="color"]::-webkit-color-swatch {
      border: none;
  }

  input[type="text"] {
    padding-left: 65px;
  }
`;

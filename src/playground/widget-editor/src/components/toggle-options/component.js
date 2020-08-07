import React from "react";
import { RiMenuLine } from 'react-icons/ri';

const ToggleOptions = ({ optionsActive, modifyOptions }) => {
  return (
    <button onClick={() => modifyOptions({ optionsOpen: !optionsActive })}>
      <RiMenuLine />{optionsActive ? "Close options" : "View options"}
    </button>
  );
};

export default ToggleOptions;

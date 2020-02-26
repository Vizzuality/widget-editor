import React from "react";

const ToggleOptions = ({ optionsActive, modifyOptions }) => {
  return (
    <button onClick={() => modifyOptions({ optionsOpen: !optionsActive })}>
      {optionsActive ? "Close options" : "View options"}
    </button>
  );
};

export default ToggleOptions;

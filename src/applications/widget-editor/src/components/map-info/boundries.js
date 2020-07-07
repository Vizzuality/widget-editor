import React from "react";
import Select from "react-select";

import { InputStyles } from './styles';

const serializeSelection = (o) => ({
  value: o.id,
  label: o.label,
});

const BoundriesSelection = ({ configuration, boundaries, onSetBoundry }) => {
  const selectedBoundry = configuration?.map?.basemap?.boundaries === true ? boundaries['dark'] : null;
  const serialize = Object.keys(boundaries).map((bound) =>
    serializeSelection(boundaries[bound])
  );
  return (
    <Select
      onChange={(boundry) => onSetBoundry(boundry ? true : false)}
      isClearable={true}
      value={selectedBoundry}
      options={serialize}
      styles={InputStyles}
    />
  );
};

export default BoundriesSelection;

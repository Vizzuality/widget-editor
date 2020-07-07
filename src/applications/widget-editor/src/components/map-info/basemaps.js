import React from "react";
import Select from "react-select";

import { InputStyles } from './styles';

const serializeSelection = (o) => ({
  value: o.id,
  label: o.label,
});

const BasemapSelection = ({ configuration, basemaps, onSetBasemap }) => {
  const selectedBasemap = configuration?.map.basemap?.basemap || "dark";
  const selectedOption = serializeSelection(basemaps[selectedBasemap]);
  const serialize = Object.keys(basemaps).map((basemap) =>
    serializeSelection(basemaps[basemap])
  );
  return (
    <Select
      onChange={(option) => onSetBasemap(option)}
      value={selectedOption}
      options={serialize}
      styles={InputStyles}
    />
  );
};

export default BasemapSelection;

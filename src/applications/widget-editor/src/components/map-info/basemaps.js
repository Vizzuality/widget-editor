import React from "react";
import Select from "react-select";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    background: "#FFF",
    borderRadius: "4px",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

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

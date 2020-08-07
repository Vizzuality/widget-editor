import React from "react";
import Select from "react-select";

import { InputStyles } from './styles';

const serializeSelection = (o) => ({
  value: o.id,
  label: o.label,
});

const LabelsSelection = ({ configuration, labels, onSetLabel }) => {
  const selectedLabel = configuration.map.basemap.labels;
  const selectedOption = serializeSelection(labels[selectedLabel]);
  const serialize = Object.keys(labels).map((basemap) =>
    serializeSelection(labels[basemap])
  );
  return (
    <Select
      onChange={(label) => onSetLabel(label.value)}
      value={selectedOption}
      options={serialize}
      styles={InputStyles}
    />
  );
};

export default LabelsSelection;

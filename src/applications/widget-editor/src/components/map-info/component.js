import React from "react";

import Select from "react-select";

import BASEMAPS from "@widget-editor/shared/lib/constants/basemaps";

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import BasemapSelection from "./basemaps";

const InputStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    display: "flex",
    border: "1px solid rgba(202,204,208,0.85)",
    borderRadius: "4px",
    background: "#FFF",
    padding: "3px 0",
  }),
  option: (base) => ({
    ...base,
  }),
};

const generateOptions = (layers) => {
  if (!layers) {
    return [];
  }
  return layers.map((l) => ({
    label: l.attributes.name,
    value: l.id,
  }));
};

const MapInfo = ({ editor, configuration, patchConfiguration }) => {
  const { layers = null } = editor;
  const options = generateOptions(layers);
  const selectedOption = options.find((o) => o.value === configuration.layer);

  if (!selectedOption && options.length > 0) {
    patchConfiguration({
      layer: options[0].value
    });
  }

  const handleChange = (option) => {
    patchConfiguration({
      layer: option.value,
    });
  };

  const setBasemap = (basemap) => {
    patchConfiguration({
      map: {
        ...configuration.map,
        basemap: {
          basemap: BASEMAPS[basemap].id,
          labels: BASEMAPS[basemap].label,
          boundaries: false,
        },
      },
    });
  };

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="options-title">Layers</FormLabel>
        <Select
          onChange={(option) => handleChange(option)}
          value={selectedOption}
          options={options}
          styles={InputStyles}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-zoom">Basemap</FormLabel>
        <BasemapSelection
          configuration={configuration}
          basemaps={BASEMAPS}
          onSetBasemap={(basemap) => setBasemap(basemap.value)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-zoom">Map Zoom</FormLabel>
        <Input
          type="text"
          className="read-only"
          readOnly
          name="options-zoom"
          value={configuration.map.zoom}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-lat-lng">Latitude & Longitude</FormLabel>
        <Input
          type="text"
          className="read-only"
          readOnly
          name="options-lat-lng"
          value={`${configuration.map.lat},${configuration.map.lng}`}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-bbox">Bounding box</FormLabel>
        <Input
          type="text"
          className="read-only"
          readOnly
          name="options-bbox"
          value={`[${configuration.map.bbox.join()}]`}
        />
      </InputGroup>
    </FlexContainer>
  );
};

export default MapInfo;

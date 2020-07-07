import React, { useEffect } from "react";

import Select from "react-select";

import { BASEMAPS, LABELS, BOUNDARIES } from '@widget-editor/map/lib/constants';

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";
import Input from "styles-common/input";

import BasemapSelection from "./basemaps";
import LabelSelection from "./labels";
import BoundariesSelection from "./boundries";

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

  useEffect(() => {
    if (!selectedOption && options.length > 0) {
      patchConfiguration({
        layer: options[0].value
      });
    }
  }, [selectedOption, options, patchConfiguration])


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
            ...configuration.map.basemap,
            basemap
        }
      },
    });
  };

  const setLabels = (label) => {
    patchConfiguration({
      map: {
        ...configuration.map,
        basemap: {
          ...configuration.map.basemap,
         labels: label
        },
      },
    });
  }

  const setBoundaries = (active) => {
    patchConfiguration({
      map: {
        ...configuration.map,
        basemap: {
            ...configuration.map.basemap,
            boundaries: active
        }
      },
    });
  }

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
        <FormLabel htmlFor="options-basemap">Basemap</FormLabel>
        <BasemapSelection
          configuration={configuration}
          basemaps={BASEMAPS}
          onSetBasemap={(basemap) => setBasemap(basemap)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-labels">Labels</FormLabel>
        <LabelSelection
          configuration={configuration}
          labels={LABELS}
          onSetLabel={(label) => setLabels(label)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="options-boundries">Boundaries</FormLabel>
        <BoundariesSelection
          configuration={configuration}
          boundaries={BOUNDARIES}
          onSetBoundry={(active) => setBoundaries(active)}
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

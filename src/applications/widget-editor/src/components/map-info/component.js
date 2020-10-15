import React, { useEffect } from "react";

import { Select } from "@widget-editor/shared";
import { BASEMAPS, LABELS, BOUNDARIES } from '@widget-editor/map/lib/constants';

import FlexContainer from "styles-common/flex";
import FormLabel from "styles-common/form-label";
import InputGroup from "styles-common/input-group";

const generateOptions = (layers) => {
  if (!layers) {
    return [];
  }
  return layers.map((l) => ({
    label: l.attributes.name,
    value: l.id,
  }));
};

const MapInfo = ({ editor, configuration, patchConfiguration, editorSyncMap }) => {
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
    const patch = {
      ...configuration.map,
      basemap: {
          ...configuration.map.basemap,
          basemap
      }
    }
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  };

  const setLabels = (label) => {
    const patch = {
      ...configuration.map,
      basemap: {
        ...configuration.map.basemap,
       labels: label
      }
    }
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  }

  const setBoundaries = (active) => {
    const patch = {
      ...configuration.map,
      basemap: {
          ...configuration.map.basemap,
          boundaries: active
      }
    };
    editorSyncMap(patch)
    patchConfiguration({
      map: patch
    });
  }

  return (
    <FlexContainer>
      <InputGroup>
        <FormLabel htmlFor="map-options-title">Layers</FormLabel>
        <Select
          id="map-options-title"
          value={selectedOption}
          options={options}
          onChange={(option) => handleChange(option)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="map-options-basemap">Basemap</FormLabel>
        <Select
          id="map-options-basemap"
          value={{
            label: BASEMAPS[configuration.map.basemap.basemap].label,
            value: BASEMAPS[configuration.map.basemap.basemap].id,
          }}
          options={Object.keys(BASEMAPS).map(basemap => ({
            label: BASEMAPS[basemap].label,
            value: BASEMAPS[basemap].id,
          }))}
          onChange={option => setBasemap(option.value)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="map-options-labels">Labels</FormLabel>
        <Select
          id="map-options-labels"
          value={{
            label: LABELS[configuration.map.basemap.labels].label,
            value: LABELS[configuration.map.basemap.labels].id,
          }}
          options={Object.keys(LABELS).map(labels => ({
            label: LABELS[labels].label,
            value: LABELS[labels].id,
          }))}
          onChange={label => setLabels(label.value)}
        />
      </InputGroup>
      <InputGroup>
        <FormLabel htmlFor="map-options-boundaries">Boundaries</FormLabel>
        <Select
          id="map-options-boundaries"
          value={configuration?.map?.basemap?.boundaries === true ? BOUNDARIES['dark'] : null}
          options={Object.keys(BOUNDARIES).map(boundaries => ({
            label: BOUNDARIES[boundaries].label,
            value: BOUNDARIES[boundaries].id,
          }))}
          onChange={boundaries => setBoundaries(boundaries ? true : false)}
          isClearable={true}
        />
      </InputGroup>
    </FlexContainer>
  );
};

export default MapInfo;

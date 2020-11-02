import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { Select } from "@widget-editor/shared";

const GeoFilter = ({ dataService, areaIntersection, setFilters, patchConfiguration }) => {
  const [predefinedAreasOptions, setPredefinedAreasOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeArea = useCallback((option) => {
    setFilters({ areaIntersection: option?.value ?? null });
    patchConfiguration();
  }, [patchConfiguration, setFilters]);

  useEffect(() => {
    const fetchAreas = async () => {
      const options = (await dataService.getPredefinedAreas())
        .map(({ id, name }) => ({
          label: name,
          value: id,
        }));

      setPredefinedAreasOptions(options);
    };

    fetchAreas();
  }, [dataService, setPredefinedAreasOptions]);

  useEffect(() => {
    if (!areaIntersection) {
      setSelectedOption(null);
    } else {
      setSelectedOption(predefinedAreasOptions.find(option => option.value === areaIntersection));
    }
  }, [areaIntersection, predefinedAreasOptions, setSelectedOption]);
  
  return (
    <Select
      id="geo-filter"
      name="geo-filter"
      aria-label="Select an area"
      placeholder="Select an area"
      value={selectedOption}
      options={predefinedAreasOptions}
      onChange={onChangeArea}
      isClearable
    />
  );
};

GeoFilter.propTypes = {
  dataService: PropTypes.object.isRequired,
  areaIntersection: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  patchConfiguration: PropTypes.func.isRequired,
};

GeoFilter.defaultProps = {
  areaIntersection: null,
};

export default GeoFilter;

import React, { Suspense, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import useDebounce from "hooks/use-debounce";

import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import QueryLimit from "components/query-limit";
import Filter from "components/filter";
import EndUserFilters from "components/end-user-filters";

import { DEFAULT_BORDER } from "@widget-editor/shared/lib/styles/style-constants";

const AdvancedEditor = React.lazy(() => import("../advanced-editor"));
const TableView = React.lazy(() => import("../table-view"));
const Typography = React.lazy(() => import("../typography"));
const ColorSchemes = React.lazy(() => import("../color-schemes"));
const DonutRadius = React.lazy(() => import("../donut-radius"));
const SliceCount = React.lazy(() => import("../slice-count"));
const MapInfo = React.lazy(() => import("../map-info"));

const StyleEditorOptionsInfo = styled.div`
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
  h3 {
    color: ${(props) => props.color || "#ff6464"};
    text-align: center;
  }
  p {
    color: #bfbfbf;
    font-size: 12px;
  }
`;

const StyledContainer = styled.div`
  position: relative;
  flex: 1;
  padding: 0 0 0 20px;
  margin: 10px 0;
  height: calc(100% - 20px);
  overflow-y: hidden;
  ${DEFAULT_BORDER(1, 1, 1, 0)}

  ${(props) => (props.compact.isCompact || props.compact.forceCompact) && css`
    height: 100%;
    margin: 0;
    padding: 0;
    ${DEFAULT_BORDER(1, 0, 0, 0)}
    box-shadow: none;
  `}
`;

const EditorOptions = ({
  initialized,
  restoring,
  advanced,
  rasterOnly,
  disabledFeatures,
  datasetId,
  limit,
  donutRadius,
  sliceCount,
  data,
  orderBy,
  patchConfiguration,
  compact,
  dataService,
  isMap,
  chartType,
}) => {
  const tabsVisibility = useMemo(() => ({
    general: true,
    map: isMap,
    style: !isMap && !advanced && (
      disabledFeatures.indexOf("typography") === -1
        || disabledFeatures.indexOf("theme-selection") === -1
    ),
    advanced: disabledFeatures.indexOf("advanced-editor") === -1 && !isMap,
    table: disabledFeatures.indexOf("table-view") === -1 && !isMap && !advanced,
  }), [isMap, advanced, disabledFeatures]);

  const handleSliceCount = useDebounce((value) => {
    patchConfiguration({ sliceCount: parseInt(value) });
  });

  const handleDonutRadius = useDebounce((value) => {
    patchConfiguration({ donutRadius: parseInt(value) });
  });

  // const handleGroupBy = (value) => {
  //   patchConfiguration({ groupBy: value });
  // }

  const handleLimit = useDebounce((value) => {
    patchConfiguration({ limit: value });
  });

  if (!initialized || restoring) {
    return (
      <StyledContainer compact={compact}>
        <StyleEditorOptionsInfo color="#8c8c8c">
          <h3>Loading settings...</h3>
        </StyleEditorOptionsInfo>
      </StyledContainer>
    );
  }

  if (!datasetId && initialized && !restoring) {
    return (
      <StyledContainer compact={compact}>
        <StyleEditorOptionsInfo>
          <h3>Error loading dataset</h3>
          <p>Dataset not accessible at this moment.</p>
        </StyleEditorOptionsInfo>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer compact={compact}>
      <Tabs visible={tabsVisibility}>
        <Tab id="general" label="General">
          <Accordion>
            <AccordionSection title="Description and labels" openDefault>
              <WidgetInfo isMap={isMap} />
            </AccordionSection>
            {!isMap && !advanced && (
              <AccordionSection title="Filters">
                <Filter dataService={dataService} />
              </AccordionSection>
            )}
            {!isMap && !advanced && disabledFeatures.indexOf("end-user-filters") === -1 && (
              <AccordionSection title="End-user filters">
                <EndUserFilters />
              </AccordionSection>
            )}
            {!isMap && !advanced && (
              <AccordionSection title="Order">
                <OrderValues />
                {limit !== undefined && limit !== null && (
                  <QueryLimit
                    min={0}
                    max={500}
                    onChange={handleLimit}
                    label="Limit"
                    value={limit}
                  />
                )}
              </AccordionSection>
            )}
            {!isMap && !rasterOnly && !advanced
              && (chartType === 'pie' || chartType === 'donut') && (
              <AccordionSection title="Chart specific">
                {chartType === 'donut' && (
                  <Suspense fallback={<div>Loading...</div>}>
                    {donutRadius && (
                      <DonutRadius
                        value={donutRadius}
                        onChange={(value) => handleDonutRadius(value)}
                      />
                    )}
                  </Suspense>
                )}
                <Suspense fallback={<div>Loading...</div>}>
                  {sliceCount && data && (
                    <SliceCount
                      value={sliceCount}
                      data={data}
                      onChange={(value) => handleSliceCount(value)}
                    />
                  )}
                </Suspense>
              </AccordionSection>
            )}
          </Accordion>
        </Tab>

        <Tab id="map" label="Map">
          <Accordion>
            <AccordionSection title="Configuration" openDefault>
              <Suspense fallback={<div>Loading...</div>}>
                <MapInfo />
              </Suspense>
            </AccordionSection>
          </Accordion>
        </Tab>

        <Tab id="style" label="Visual style">
          <Accordion>
            {disabledFeatures.indexOf("typography") === -1 && (
              <AccordionSection title="Typography">
                <Suspense fallback={<div>Loading...</div>}>
                  <Typography />
                </Suspense>
              </AccordionSection>
            )}

            {disabledFeatures.indexOf("theme-selection") === -1 && (
              <AccordionSection
                title="Color scheme"
                openDefault={disabledFeatures.indexOf("typography") !== -1}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <ColorSchemes />
                </Suspense>
              </AccordionSection>
            )}
          </Accordion>
        </Tab>

        <Tab id="advanced" label="Advanced">
          <Suspense fallback={<div>Loading...</div>}>
            <AdvancedEditor />
          </Suspense>
        </Tab>

        <Tab id="table" label="Table view">
          <Suspense fallback={<div>Loading...</div>}>
            <TableView />
          </Suspense>
        </Tab>
      </Tabs>
    </StyledContainer>
  );
};

EditorOptions.propTypes = {
  patchConfiguration: PropTypes.func,
  dataService: PropTypes.object,
  compact: PropTypes.bool,
  isMap: PropTypes.bool,
  chartType: PropTypes.string,
  handleGroupBy: PropTypes.func,
  initialized: PropTypes.bool,
  restoring: PropTypes.bool,
  advanced: PropTypes.bool,
  rasterOnly: PropTypes.bool,
  disabledFeatures: PropTypes.arrayOf(PropTypes.string),
  datasetId: PropTypes.string,
  limit: PropTypes.number,
  donutRadius: PropTypes.number,
  sliceCount: PropTypes.number,
  data: PropTypes.any,
  orderBy: PropTypes.string
}

export default EditorOptions;

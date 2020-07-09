import React, { Suspense, useCallback } from "react";
import styled, { css } from "styled-components";
import debounce from 'lodash/debounce';

import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import QueryLimit from "components/query-limit";
import Filter from "components/filter";

import {
  FOOTER_HEIGHT,
  DEFAULT_BORDER,
} from "@widget-editor/shared/lib/styles/style-constants";

const AdvancedEditor = React.lazy(() => import("../advanced-editor"));
const TableView = React.lazy(() => import("../table-view"));
const Typography = React.lazy(() => import("../typography"));
const ColorShemes = React.lazy(() => import("../color-shemes"));
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
  padding: 0 0 0 30px;
  margin: 10px 0;
  height: calc(100% - 20px);
  overflow-y: hidden;
  ${DEFAULT_BORDER(1, 1, 1, 0)}
  ${(props) =>
    (props.compact.isCompact || props.compact.forceCompact) &&
    css`
      visibility: hidden;
      /* z-index: -1; */
      max-height: 0;
      position: absolute;
      top: 65px;
      left: 0;
      margin: 0;
      width: 100%;
      background: #fff;
      transition: all 0.3s ease-in-out;
    `}
  ${(props) =>
    (props.compact.isCompact || props.compact.forceCompact) &&
    props.compact.isOpen &&
    css`
      box-sizing: border-box;
      display: block;
      z-index: 2;
      visibility: visible;
      max-height: calc(100% - ${FOOTER_HEIGHT} - 65px);
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
}) => {

  const handleSliceCount = (value) => {
    patchConfiguration({ sliceCount: parseInt(value) });
  };

  const handleDonutRadius = (value) => {
    patchConfiguration({ donutRadius: parseInt(value) });
  }

  const handleOrderBy = (value) => {
    patchConfiguration({ orderBy: value });
  }

  const handleGroupBy = (value) => {
    patchConfiguration({ groupBy: value });
  }

  const handleLimit = debounce((value) => {
    patchConfiguration({ limit: value });
  }, 1000);

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
      <Tabs>
        <Tab label="General">
          <Accordion>
            <AccordionSection title="Description and labels" openDefault>
              <WidgetInfo isMap={isMap} />
            </AccordionSection>
            {!isMap && !advanced && (
              <AccordionSection title="Filters">
                <Filter dataService={dataService} />
              </AccordionSection>
            )}
            {!isMap && !advanced && (
              <AccordionSection title="Order">
                <OrderValues
                  onChange={(value) => handleOrderBy(value)}
                />
                {limit !== undefined && limit !== null && (
                  <QueryLimit
                    min={0}
                    max={50}
                    onChange={handleLimit}
                    label="Limit"
                    value={limit}
                  />
                )}
              </AccordionSection>
            )}
            {!isMap && !rasterOnly && !advanced && (
              <AccordionSection title="Chart specific">
                <Suspense fallback={<div>Loading...</div>}>
                  {donutRadius && (
                    <DonutRadius
                      value={donutRadius}
                      onChange={(value) => handleDonutRadius(value)}
                    />
                  )}
                </Suspense>
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
            {isMap && (
              <AccordionSection title="Map configuration" openDefault>
                <Suspense fallback={<div>Loading...</div>}>
                  <MapInfo />
                </Suspense>
              </AccordionSection>
            )}
          </Accordion>
        </Tab>

        <Tab label="Visual style">
          <Accordion>
            {disabledFeatures.indexOf("typogrophy") === -1 && (
              <AccordionSection title="Typography">
                <Suspense fallback={<div>Loading...</div>}>
                  <Typography />
                </Suspense>
              </AccordionSection>
            )}

            {disabledFeatures.indexOf("theme-selection") === -1 && (
              <AccordionSection title="Color">
                <Suspense fallback={<div>Loading...</div>}>
                  <ColorShemes />
                </Suspense>
              </AccordionSection>
            )}
          </Accordion>
        </Tab>

        {disabledFeatures.indexOf("advanced-editor") === -1 && (
          <Tab label="Advanced">
            <Suspense fallback={<div>Loading...</div>}>
              <AdvancedEditor />
            </Suspense>
          </Tab>
        )}

        {disabledFeatures.indexOf("table-view") === -1 && !isMap && (
          <Tab label="Table view">
            <Suspense fallback={<div>Loading...</div>}>
              <TableView />
            </Suspense>
          </Tab>
        )}
      </Tabs>
    </StyledContainer>
  );
};

export default EditorOptions;

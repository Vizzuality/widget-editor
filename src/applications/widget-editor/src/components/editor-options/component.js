import React, { Suspense } from "react";
import styled, { css } from "styled-components";

import { Accordion, AccordionSection } from "components/accordion";
import { Tabs, Tab } from "components/tabs";
import WidgetInfo from "components/widget-info";
import OrderValues from "components/order-values";
import GroupValues from "components/group-values";
import QueryLimit from "components/query-limit";
import Filter from "components/filter";

import {
  FOOTER_HEIGHT,
  DEFAULT_BORDER,
} from "@widget-editor/shared/lib/styles/style-constants";

const JsonEditor = React.lazy(() => import("../json-editor"));
const TableView = React.lazy(() => import("../table-view"));
const Typography = React.lazy(() => import("../typography"));
const ColorShemes = React.lazy(() => import("../color-shemes"));
const DonutRadius = React.lazy(() => import("../donut-radius"));
const SlizeCount = React.lazy(() => import("../slize-count"));
const Layers = React.lazy(() => import("../layers"));

const StyleEditorOptionsErrors = styled.div`
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
  h3 {
    color: #ff6464;
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
  background: #fff;
  padding: 0 0 0 30px;
  margin: 10px 0;
  overflow-y: hidden;
  ${DEFAULT_BORDER(1, 1, 1, 0)}
  ${(props) =>
    props.compact.isCompact &&
    css`
      visibility: hidden;
      /* z-index: -1; */
      max-height: 0;
      position: absolute;
      top: 65px;
      left: 0;
      margin: 0;
      width: 100%;
      transition: all 0.3s ease-in-out;
    `}
  ${(props) =>
    props.compact.isCompact &&
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
  disabledFeatures,
  datasetId,
  limit,
  donutRadius,
  slizeCount,
  data,
  orderBy,
  groupBy,
  patchConfiguration,
  compact,
  dataService,
  isMap,
}) => {
  const handleChange = (value, type) => {
    if (type === "limit") {
      patchConfiguration({ limit: value });
    }
    if (type === "orderBy") {
      patchConfiguration({ orderBy: value });
    }
    if (type === "groupBy") {
      patchConfiguration({ groupBy: value });
    }
    if (type === "donut-radius") {
      patchConfiguration({ donutRadius: parseInt(value) });
    }
    if (type === "slize-count") {
      patchConfiguration({ slizeCount: parseInt(value) });
    }
  };

  if (!datasetId) {
    return (
      <StyledContainer compact={compact}>
        <StyleEditorOptionsErrors>
          <h3>Error loading dataset</h3>
          <p>Dataset not accessible at this moment.</p>
        </StyleEditorOptionsErrors>
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
            {!isMap && (
              <AccordionSection title="Filters">
                <Filter dataService={dataService} />
              </AccordionSection>
            )}
            {!isMap && (
              <AccordionSection title="Order">
                <OrderValues
                  onChange={(value) => handleChange(value, "orderBy")}
                />
                <GroupValues
                  onChange={(value) => handleChange(value, "groupBy")}
                />
                {limit && (
                  <QueryLimit
                    min={0}
                    max={500}
                    onChange={(value) => handleChange(value, "limit")}
                    handleOnChangeValue={(value) =>
                      handleChange(value, "limit")
                    }
                    label="Limit"
                    value={limit}
                  />
                )}
              </AccordionSection>
            )}
            {!isMap && (
              <AccordionSection title="Chart specific">
                <Suspense fallback={<div>Loading...</div>}>
                  {donutRadius && (
                    <DonutRadius
                      value={donutRadius}
                      onChange={(value) => handleChange(value, "donut-radius")}
                      handleOnChangeValue={(value) =>
                        handleChange(value, "donut-radius")
                      }
                    />
                  )}
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                  {slizeCount && data && (
                    <SlizeCount
                      value={slizeCount}
                      data={data}
                      onChange={(value) => handleChange(value, "slize-count")}
                      handleOnChangeValue={(value) =>
                        handleChange(value, "slize-count")
                      }
                    />
                  )}
                </Suspense>
              </AccordionSection>
            )}
            {isMap && (
              <AccordionSection title="Map configuration" openDefault>
                <Suspense fallback={<div>Loading...</div>}>
                  <Layers />
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
              <AccordionSection title="Color" openDefault>
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
              <JsonEditor />
            </Suspense>
          </Tab>
        )}

        {disabledFeatures.indexOf("table-view") === -1 && (
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

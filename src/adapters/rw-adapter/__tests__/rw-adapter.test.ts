import RwAdapter from "../src";
describe('RW Adapter tests', () => {
  test("Adapter getWidget returns expected result", async () => {
    const adapter = new RwAdapter();
    const widgetId = 'e60bba32-d1c8-4d86-bd44-ba3a56a7d717';
    const payloadResponse = await adapter.getWidget(widgetId);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getDataset returns expected result", async () => {
    const adapter = new RwAdapter();
    const datasetId = '03bfb30e-829f-4299-bab9-b2be1b66b5d4';
    const payloadResponse = await adapter.getDataset(datasetId);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getDatasetLayers returns expected result", async () => {
    const adapter = new RwAdapter();
    const datasetId = '03bfb30e-829f-4299-bab9-b2be1b66b5d4';
    const payloadResponse = await adapter.getDatasetLayers(datasetId);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getDatasetData returns expected result", async () => {
    const adapter = new RwAdapter();
    const datasetId = '03bfb30e-829f-4299-bab9-b2be1b66b5d4';
    const SQL = 'SELECT * FROM for_020_forest_employment_gdp_edit LIMIT 50';
    const payloadResponse = await adapter.getDatasetData(datasetId, SQL);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getDatasetFields returns expected result", async () => {
    const adapter = new RwAdapter();
    const datasetId = '03bfb30e-829f-4299-bab9-b2be1b66b5d4';
    const dataset = await adapter.getDataset(datasetId);
    const payloadResponse = await adapter.getDatasetFields(datasetId, dataset);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getLayer returns expected result", async () => {
    const adapter = new RwAdapter();
    const layerId = '2bb367e3-adba-4ca1-ba96-eb58014deaec';
    const payloadResponse = await adapter.getLayer(layerId);
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getUserAreas returns expected result", async () => {
    const adapter = new RwAdapter();
    const payloadResponse = await adapter.getUserAreas();
    expect(payloadResponse).toMatchSnapshot();
  });

  test("Adapter getUserAreas returns expected result", async () => {
    const adapter = new RwAdapter();
    const payloadResponse = await adapter.getUserAreas();
    expect(payloadResponse).toMatchSnapshot();
  });
});

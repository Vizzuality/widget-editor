export default (widgetConfig: Object, x: string, y: string) => {
  const format = widgetConfig.paramsConfig?.format;
  let res = JSON.stringify({
    [widgetConfig?.paramsConfig?.value?.alias]: x,
    [widgetConfig?.paramsConfig?.category?.alias]: y,
  });
  res = res.replace(/"datum\.x"/g, "datum.x");
  res = res.replace(
    /"datum\.y"/g,
    `format(datum.y, '${format === "s" ? ".1f" : format}')`
  );
  return res;
};

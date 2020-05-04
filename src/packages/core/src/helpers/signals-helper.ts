export default (widgetConfig: any, x: string, y: string) => {
  const format = widgetConfig.paramsConfig?.format;
  let res = JSON.stringify({
    [widgetConfig?.paramsConfig?.value?.alias || 'x']: x,
    [widgetConfig?.paramsConfig?.category?.alias || 'y']: y,
  });
  res = res.replace(/"((datum)(\.datum)?)\.x"/g, "$1.x");
  res = res.replace(
    /"((datum)(\.datum)?)\.y"/g,
    `format($1.y, '${format === "s" ? ".1f" : format}')`
  );
  return res;
};

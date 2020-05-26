// TODO: Explain whats going on here
export default (widgetConfig: any, x: string, y: string, parse: boolean = true) => {
  const format = widgetConfig.paramsConfig?.format || 's';
  let res = JSON.stringify({
    [widgetConfig?.paramsConfig?.value?.alias || 'x']: x,
    [widgetConfig?.paramsConfig?.category?.alias || 'y']: y,
  });
  if (parse) {
    res = res.replace(/"((datum)(\.datum)?)\.x"/g, "$1.x");
    res = res.replace(
      /"((datum)(\.datum)?)\.y"/g,
      `format($1.y, '${format === "s" ? ".1f" : format}')`
    );
  } else {
    // Simply replace quotes of no parsing 
    res = res.replace(/"datum\['value'\]"/g, `format(datum.value, '${format === "s" ? ".1f" : format}')`);
    res = res.replace(/"datum\['category'\]"/g, "datum.category");
  }
  return res;
};

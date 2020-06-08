export default class ParseSignals {
  schema: any;
  widgetConfig: any;
  tooltipConfig: any;
  valueAlias: string;
  categoryAlias: string;
  chartType: string;
  isDate: boolean;
  isCustom: boolean;
  standalone: boolean;
  datumXIndicator: string;
  datumYIndicator: string;

  constructor(schema: any, widgetConfig: any, isDate: boolean = false, standalone: boolean = false) {
    this.isDate = isDate;
    this.widgetConfig = widgetConfig || schema;
    this.schema = schema;
    this.isCustom = !this.widgetConfig?.paramsConfig;
    this.standalone = standalone;
    this.chartType = this.isCustom ? this.getCustomChartType(schema) : this.widgetConfig?.paramsConfig?.chartType;
  }

  resolveMarkGroup(marks: any) {
    let chartType;
    marks.map(mark => {
      if (mark.type === 'rect' && !chartType) {
        chartType = 'bar';
      }
      if (mark.type === 'path' && !chartType) {
        chartType = 'line';
      }
    })
    return chartType;
  }

  // XXX: for custom charts
  // We try to determen where to put the tooltip
  getCustomChartType(schema: any) {
    let chartType;
    schema.marks.map(mark => {
      if (mark.type === 'rect' && !chartType) {
        chartType = 'bar';
      }
      if (mark.type === 'path' && !chartType) {
        chartType = 'line';
      }
      if (mark.type === 'arc' && !chartType) {
        chartType = 'pie';
      }
      if (mark.type === 'group' && !chartType) {
        chartType = this.resolveMarkGroup(mark.marks)
      }
    })
    return chartType;
  }

  // XXX: Custom configurations they can define this
  // but to keep the logic similar, we strip it out and apply it ourselfs
  stripDatum(str: string) {
    return str.replace(/datum./, '');
  }

  assignSignal() {
    const signals = [];
    const datumFormat = this.chartType === 'line' ? 'datum.datum' : 'datum';

    this.getTooltipFields().forEach(field => {
      if (field.format && field.type === 'number') {
        signals.push(`"${field.property}": format(${datumFormat}.${this.stripDatum(field.column)}, "${field.format}")`);
      } else if (field.format && field.type === 'date') {
        signals.push(`"${field.property}": utcFormat(${datumFormat}.${this.stripDatum(field.column)}, "${field.format}")`);
      } else {
        signals.push(`"${field.property}": ${datumFormat}.${this.stripDatum(field.column)}`);
      }
    })

    const signal = `{ ${signals.join()} }`;

    return { signal };
  }

  getTooltipFields() {
    let interactionConfig = [];
    if (this.schema.hasOwnProperty('interaction_config')) {
      interactionConfig = this.schema.interaction_config;
    } else if (this.widgetConfig.hasOwnProperty('interaction_config')) {
      interactionConfig = this.widgetConfig.interaction_config;
    }

    const tooltipConfig = interactionConfig.find(c => c.name === "tooltip");

    if (!tooltipConfig?.config?.fields?.length) {
      return [];
    }

    return tooltipConfig.config.fields;
  }

  tooltipSet(chartType, marks) {
    let match = false;
    marks.forEach(mark => {
      if (chartType === 'pie' && mark.type === 'arc') {
        match = !!mark?.encode?.enter?.tooltip
      }
    })
    return match;
  }

  // This makes sure we have our tooltip on previous widgets
  // And also on any custom widget sent to the renderer
  parseLegacy() {
    const chartType = this.widgetConfig?.paramsConfig?.chartType;
    let serializedMarks = this.schema.marks;

    const hasTooltip = this.tooltipSet(chartType, this.schema.marks);
    if (!hasTooltip) {
      if (this.chartType === 'pie' || this.chartType === 'donut') {
        serializedMarks = this.pieMarks(this.schema.marks);
      }
      if (this.chartType === 'line') {
        serializedMarks = this.lineMarks(this.schema.marks)
      }

      if (this.chartType === 'bar' || this.chartType === 'bar-horizontal') {
        serializedMarks = this.barMarks(this.schema.marks);
      }

      if (this.chartType === 'scatter') {
        serializedMarks = this.scatterMarks(this.schema.marks);
      }
      return serializedMarks;
    }

    return this.schema.marks;
  }

  barMarks(marks: any) {
    return marks.map(mark => {
      if (mark.type === 'rect') {
        return {
          ...mark,
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: this.assignSignal()
            }
          }
        }
      }
      if (mark.type === 'group') {
        return {
          ...mark,
          marks: this.barMarks(mark.marks)
        }
      }
      return mark;
    })
  }

  lineMarks(marks: any) {
    return marks.map(mark => {
      if (mark.type === 'path') {
        return {
          ...mark,
          encode: {
            ...mark.encode,
            update: {
              ...mark.encode.update,
              tooltip: this.assignSignal()
            }
          }
        }
      }
      return mark;
    })
  }

  pieMarks(marks: any) {
    return marks.map(mark => {
      if (mark.type === 'arc') {
        return {
          ...mark,
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: this.assignSignal()
            }
          }
        }
      }
      return mark;
    })
  }

  scatterMarks(marks: any) {
    return marks.map(mark => {
      if (mark.type === 'symbol') {
        return {
          ...mark,
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: this.assignSignal()
            }
          }
        }
      }
      return mark;
    })
  }

  serializeSignals() {
    if (this.chartType === 'bar' || this.chartType === 'bar-horizontal'
      || this.chartType === 'stacked-bar' || this.chartType === 'stacked-bar-horizontal') {
      return {
        ...this.schema,
        marks: this.barMarks(this.schema.marks)
      }
    }

    if (this.chartType === 'line') {
      return {
        ...this.schema,
        marks: this.lineMarks(this.schema.marks)
      }
    }

    if (this.chartType === 'pie' || this.chartType === 'donut') {
      return {
        ...this.schema,
        marks: this.pieMarks(this.schema.marks)
      }
    }

    if (this.chartType === 'scatter') {
      return {
        ...this.schema,
        marks: this.scatterMarks(this.schema.marks)
      }
    }

  }

}

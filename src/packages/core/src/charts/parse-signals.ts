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

    const fields = this.getTooltipFields();
    this.tooltipConfig = fields.map(({ column, property, type, format }) => ({
      field: column,
      title: property,
      formatType: type === "date" ? "time" : type,
      format,
    }))
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
    let signal = "";

    const datumFormat = this.chartType === 'line' ? 'datum.datum' : 'datum';

    this.tooltipConfig.forEach(field => {
      if (field.format && field.formatType === 'number' && field.format) {
        signals.push(`"${field.title}": format(${datumFormat}.${this.stripDatum(field.field)}, "${field.format}")`)
      } else if (field.format && field.formatType === 'time' && field.format) {
        signals.push(`"${field.title}": utcFormat(${datumFormat}.${this.stripDatum(field.field)}, "${field.format}")`)
      } else {
        signals.push(`"${field.title}": ${datumFormat}.${this.stripDatum(field.field)}`)
      }
    })
    
    signal = `{ ${signals.join()} }`
    return {
      signal
    }
  }

  getTooltipFields() {
    const interactionConfig = this.widgetConfig.hasOwnProperty('interaction_config') ? 
      this.widgetConfig.interaction_config : 
      this.schema.hasOwnProperty('interaction_config') ? this.schema.interaction_config : [];

    // We don't have the interaction config object defined
    if (
      !interactionConfig ||
      !interactionConfig.length
    ) {
      return [];
    }
  
    const tooltipConfig = interactionConfig.find(
      (c) => c.name === "tooltip"
    );
  
    // We don't have the tooltip config defined
    if (
      !tooltipConfig ||
      !tooltipConfig.config ||
      !tooltipConfig.config.fields ||
      !tooltipConfig.config.fields.length
    ) {
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
    if (this.chartType === 'bar' || this.chartType === 'bar-horizontal') {
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

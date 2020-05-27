export default class ParseSignals {
  schema: any;
  widgetConfig: any;
  valueAlias: string;
  categoryAlias: string;
  chartType: string;
  isDate: boolean;
  isCustom: boolean;
  datumXIndicator: string;
  datumYIndicator: string;

  constructor(schema: any, widgetConfig: any, isDate: boolean = false) {
    this.isDate = isDate;
    this.widgetConfig = widgetConfig;
    this.schema = schema;
    this.isCustom = !this.widgetConfig?.paramsConfig;
    this.chartType = this.isCustom ? this.widgetConfig.chartType : this.widgetConfig?.paramsConfig?.chartType;
    
    this.valueAlias = this.resolveValueAlias();
    this.categoryAlias = this.resolveCategoryAlias();
    // TODO: Check why we are parsing this different for pie charts

    this.getColumnIndicators();
  }

  // TODO: Clean this up, and verify edge cases
  getColumnIndicators() {
    if (this.widgetConfig.interaction_config) {
      this.widgetConfig.interaction_config.forEach(conf => {
        if (conf.name === 'tooltip' && conf.config.fields.length === 2) {
          this.datumXIndicator = conf.config.fields[0].column;
          this.datumYIndicator = conf.config.fields[1].column;
        }
      })
    } else {
      this.datumXIndicator = this.isCustom && this.chartType === 'pie' ? 'value' : 'x';
      this.datumYIndicator = this.isCustom && this.chartType === 'pie' ? 'category' : 'y';
    }
  }

  resolveValueAlias() {
    if (this.isCustom) {
      return this.widgetConfig.value.alias;
    }
    return this.widgetConfig.paramsConfig.value.alias;
  }

  resolveCategoryAlias() {
    if (this.isCustom) {
      return this.widgetConfig.category.alias;
    }
    return this.widgetConfig.paramsConfig.category.alias;
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
    const barFormatX = this.isDate ? `utcFormat(datum.${this.datumXIndicator}, \'%d %b\')` : `datum.${this.datumXIndicator}`;
    return marks.map(mark => {
      if (mark.type === 'rect') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.${this.datumYIndicator}, "${this.categoryAlias}": ${barFormatX} }`,
              }
            }
          }
        }
      }
      return mark;
    })
  }

  lineMarks(marks: any) {
    const lineFormatX = this.isDate ? `utcFormat(datum.datum.${this.datumXIndicator}, \'%d %b\')` : `datum.datum.${this.datumXIndicator}`;
    return marks.map(mark => {
      if (mark.type === 'path') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            update: {
              ...mark.encode.update,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.datum.${this.datumYIndicator}, "${this.categoryAlias}": ${lineFormatX} }`,
              }
            }
          }
        }
      }
      return mark;
    })
  }

  pieMarks(marks: any) {
    const pieFormatX = this.isDate ? `utcFormat(datum.${this.datumXIndicator}, \'%d %b\')` : `datum.${this.datumXIndicator}`;
    return marks.map(mark => {
      if (mark.type === 'arc') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.${this.datumYIndicator}, "${this.categoryAlias}": ${pieFormatX} }`,
              }
            }
          }
        }
      }
      return mark;
    })
  }

  scatterMarks(marks: any) {
    const scatterFormatX = this.isDate ? `utcFormat(datum.${this.datumXIndicator}, \'%d %b\')` : `datum.${this.datumXIndicator}`;
    return marks.map(mark => {
      if (mark.type === 'symbol') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.${this.datumYIndicator}, "${this.categoryAlias}": ${scatterFormatX} }`,
              }
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
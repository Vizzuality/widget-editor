export default class ParseSignals {
  schema: any;
  widgetConfig: any;
  valueAlias: string;
  categoryAlias: string;
  chartType: string;
  isDate: boolean;

  constructor(schema: any, widgetConfig: any, isDate: boolean = false) {
    this.isDate = isDate;
    this.widgetConfig = widgetConfig;
    this.schema = schema;
    this.chartType = this.widgetConfig?.paramsConfig?.chartType;
    this.valueAlias = this.widgetConfig.paramsConfig.value.alias || 'x'
    this.categoryAlias = this.widgetConfig.paramsConfig.category.alias || 'y'
  }

  barMarks(marks: any) {
    const barFormatX = this.isDate ? 'utcFormat(datum.x, \'%d %b\')' : 'datum.x';
    return marks.map(mark => {
      if (mark.type === 'rect') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.y, "${this.categoryAlias}": ${barFormatX} }`,
              }
            }
          }
        }
      }
      return mark;
    })
  }

  lineMarks(marks: any) {
    const lineFormatX = this.isDate ? 'utcFormat(datum.datum.x, \'%d %b\')' : 'datum.datum.x';
    return marks.map(mark => {
      if (mark.type === 'path') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            update: {
              ...mark.encode.update,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.datum.y, "${this.categoryAlias}": ${lineFormatX} }`,
              }
            }
          }
        }
      }
      return mark;
    })
  }

  pieMarks(marks: any) {
    const pieFormatX = this.isDate ? 'utcFormat(datum.x, \'%d %b\')' : 'datum.x';
    return marks.map(mark => {
      if (mark.type === 'arc') {
        return {
          ...mark, 
          encode: {
            ...mark.encode,
            enter: {
              ...mark.encode.enter,
              tooltip: {
                signal: `{ "${this.valueAlias}": datum.y, "${this.categoryAlias}": ${pieFormatX} }`,
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

  }

}
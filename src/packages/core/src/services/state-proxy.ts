import isEqual from "lodash/isEqual";

export default class StateProxy {
  localState: any;
  forceVegaUpdate: boolean;

  constructor() {
    this.localState = null;
    this.forceVegaUpdate = false;
  }

  update(state: any) {
    this.localState = state;
  }

  private getStateDiff(state) {
    return {
      prev: this.localState,
      next: state
    }
  }

  /**
   * @handleForceVegaUpdate
   * In a few cases we need to force vega to update, as these properties are already
   * applied to the local state when checking @ShouldUpdateVega
   * @propsForceVegaUpdate
   * 1. Any column: value,category,color
   * 2. When limit changes in the UI
   * 3. When aggregateFunction changes in the UI
   * @param state
   */
  private handleForceVegaUpdate(state: any) {
    const { prev, next } = this.getStateDiff(state);
    if (
      !isEqual(prev.configuration.value, next.configuration.value) ||
      !isEqual(prev.configuration.category, next.configuration.category) ||
      !isEqual(prev.configuration.color, next.configuration.color) ||
      !isEqual(prev.configuration.limit, next.configuration.limit) ||
      !isEqual(prev.configuration.aggregateFunction, next.configuration.aggregateFunction ||
        !isEqual(prev.configuration.orderBy, next.configuration.orderBy)
      )) {
      this.forceVegaUpdate = true;
    } else {
      this.forceVegaUpdate = false;
    }
  }

  ShouldUpdateData(state: any) {
    const { prev, next } = this.getStateDiff(state);
    let shouldUpdate = false;

    // If limit changes, we need to fetch new data
    shouldUpdate = prev.configuration.limit !== next.configuration.limit;

    // If value, category or color changes (AXISES)
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.value, next.configuration.value);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.category, next.configuration.category);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.color, next.configuration.color);

    // If filters change
    shouldUpdate = shouldUpdate || !isEqual(prev.filters.list, next.filters.list);

    // If the end-user filters change
    shouldUpdate = shouldUpdate || !isEqual(prev.endUserFilters, next.endUserFilters);

    // If aggregateFunction changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.aggregateFunction, next.configuration.aggregateFunction);

    // If orderBy or groupBy changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.orderBy, next.configuration.orderBy);
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.groupBy, next.configuration.groupBy);

    this.handleForceVegaUpdate(state);

    return shouldUpdate;
  }

  ShouldUpdateVega(state: any) {
    const { prev, next } = this.getStateDiff(state);

    if (this.forceVegaUpdate) {
      return true;
    }

    let shouldUpdate = false;

    // If theme changes
    shouldUpdate = !isEqual(prev.theme, next.theme);
    // Chart type changes
    shouldUpdate = shouldUpdate || (!isEqual(prev.configuration.chartType, next.configuration.chartType) && next.configuration.chartType !== 'map');
    // If widget data changes
    shouldUpdate = shouldUpdate || !isEqual(prev.editor.widgetData, next.editor.widgetData);
    // If donut radius changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.donutRadius, next.configuration.donutRadius);
    // If sliceCount changes
    shouldUpdate = shouldUpdate || !isEqual(prev.configuration.sliceCount, next.configuration.sliceCount);
    // If the advanced mode is toggled on or off
    shouldUpdate = shouldUpdate || prev.editor.advanced !== next.editor.advanced;

    return shouldUpdate;
  }

}

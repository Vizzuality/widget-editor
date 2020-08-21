import { BASE_STATE } from './mock';

import { genInstance, patchConfiguration, setFilters, setEditor, setTheme } from './helpers';

describe('State proxy tests', () => {

  test("State proxy should update local properties", () => {
    const instance = genInstance();
    expect(instance.localState).toEqual(BASE_STATE);
    expect(instance.forceVegaUpdate).toBe(false);
  });

  test("State proxy should update data and force vega update", () => {
    const instance = genInstance();
    let patch = patchConfiguration({ limit: 100 });
    let shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);

    patch = patchConfiguration({ value: 100 });
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);

    patch = patchConfiguration({ category: 100 });
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);

    patch = patchConfiguration({ color: 100 });
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);

    patch = patchConfiguration({ aggregateFunction: 100 });
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);

    patch = patchConfiguration({ orderBy: 100 });
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(true);
  });

  test(`State proxy should not call update data (as its already done) if widgetData changes
      - but force vega to update as new entries are available to visualize`, () => {
    const instance = genInstance();
    const patch = setEditor({ widgetData: [{}, {}, {}] });
    const shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(true);
    expect(shouldUpdateData).toBe(false);
  })

  test("State proxy should update data and *NOT force vega update", () => {
    const instance = genInstance();

    let patch = setFilters({ list: ['one', 'two', 'three'] });
    let shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateData).toBe(true);

    patch = { ...BASE_STATE, endUserFilters: ['one', 'two', 'three'] };
    shouldUpdateData = instance.ShouldUpdateData(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateData).toBe(true);
  });

  test("State proxy should update vega, but not data", () => {
    const instance = genInstance();

    let patch = patchConfiguration({ chartType: 'line' });
    let shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);

    patch = patchConfiguration({ donutRadius: 9999 });
    shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);

    patch = patchConfiguration({ sliceCount: 9999 });
    shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);

    patch = setTheme('some-theme')
    shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);

    patch = setEditor({ advanced: true });
    shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);

    patch = setEditor({ widgetData: [{}, {}, {}] });
    shouldUpdateVega = instance.ShouldUpdateVega(patch);
    expect(instance.forceVegaUpdate).toBe(false);
    expect(shouldUpdateVega).toBe(true);
  });

});

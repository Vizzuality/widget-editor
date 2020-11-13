import StateProxy from '../../src/services/state-proxy';

import { BASE_STATE } from './mock';

export const genInstance = (conf = null) => {
  const instance = new StateProxy();
  if (!conf || !conf.empty) {
    instance.update(BASE_STATE);
  }
  return instance;
}

export const patchConfiguration = (patch: any) => {
  return {
    ...BASE_STATE,
    configuration: {
      ...BASE_STATE.configuration,
      ...patch
    }
  };
}

export const setFilters = (patch: any) => {
  return {
    ...BASE_STATE,
    filters: {
      ...BASE_STATE.filters,
      ...patch
    }
  };
}

export const setEditor = (patch: any) => {
  return {
    ...BASE_STATE,
    editor: {
      ...BASE_STATE.editor,
      ...patch
    }
  };
}

export const setTheme = (patch: any) => {
  return {
    ...BASE_STATE,
    theme: patch
  };
}


let localCache = {};

export const localGetEditorState = (payload) => {
  localCache = {
    ...localCache,
    ...payload,
  };
};

export const localOnChangeState = (editorState) => {
  localCache.adapter.handleSave(
    (result) => {
      localCache = {
        ...localCache,
        adapterPayload: result,
        editorState,
      };
    },
    localCache.dataService,
    localCache.adapter.applications.join(","),
    editorState
  );
};

export const publicOnSave = () => {
  return {
    payload: localCache.adapterPayload,
    editorState: localCache.editorState,
  };
};

export const AdapterModifier = (Adapter, props) => {
  class ClonedAdapter extends Adapter {
    constructor() {
      super();
      Object.keys(props).forEach((prop) => {
        if (this.hasOwnProperty(prop)) {
          this[prop] = props[prop];
        } else {
          throw new Error(
            `Adapter modifier, error ${prop} does not exsist on adapter`
          );
        }
      });
    }
  }

  return ClonedAdapter;
};

export const GetAdapterAvailableProps = (Adapter) => {
  const instance = new Adapter();

  const availableProps = Object.keys(instance).map((prop) => ({
    name: prop,
    type: typeof instance[prop],
  }));

  console.log("Adapter available properties:");
  console.table(availableProps);
};

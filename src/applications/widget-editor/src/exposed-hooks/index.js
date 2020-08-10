import { constants } from "@widget-editor/core";

let localCache = {};
let REDUX_CACHE_DISPATCH = null;

export const setReduxCache = (dispatch) => {
  REDUX_CACHE_DISPATCH = dispatch;
}

export const getLocalCache = () => localCache;

export const localGetEditorState = (payload) => {
  localCache = {
    ...localCache,
    ...payload,
  };
};

export const localOnChangeState = (editorState) => {
  if (
    localCache.adapter &&
    typeof localCache.adapter.handleSave === "function"
  ) {
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
  }
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
      // XXX: Re-bind properties
      // this will re-initialize all services bound to the adapter
      this.extendProperties(props);
    }
  }
  return ClonedAdapter;
};

export const ModifyEditorState = (props) => {
  if (!REDUX_CACHE_DISPATCH) {
    throw new Error('Widget editor: ModifyEditorState hook error, We dont have access to redux dispatch.')
  }
  if (typeof props === 'object') {
    REDUX_CACHE_DISPATCH({
      type: constants.reduxActions.EDITOR_SET_CONFIGURATION,
      payload: props,
    });
  } else {
    throw new Error('Widget editor: ModifyEditorState hook error, props needs to be typeof object.')
  }
}

export const GetAdapterAvailableProps = (Adapter) => {
  const instance = new Adapter();

  const availableProps = Object.keys(instance).map((prop) => ({
    name: prop,
    type: typeof instance[prop],
  }));

  console.log("Adapter available properties:");
  console.table(availableProps);
};

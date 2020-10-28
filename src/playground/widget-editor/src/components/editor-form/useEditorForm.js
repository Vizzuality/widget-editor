import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

const getAllWidgetsForDataset = async datasetId => {
  try {
    const response = await fetch(`https://api.resourcewatch.org/v1/dataset/${datasetId}/widget`);
    const { data } = await response.json();
    return data.map(d => ({
      label: d.attributes.name,
      value: d.id
    }));
  } catch (e) {
     console.error('(Playground) failed to fetch widgets')
  }
}

const modifyOptions = payload => ({
  type: 'PLAYGROUND/modifyOptions',
  payload
});

export default function useEditorForm(autoFillValue) {
  // Store previous auto fill value so we don't add it on first run
  const prevAutoFillValue = useRef();

  // Get elements from store
  const dispatch = useDispatch();
  const datasets = useSelector(state => state.editorOptions.datasets);
  const widgets = useSelector(state => state.editorOptions.widgets);

  // Store auto fill error that we will display in UI
  const [autoFillError, hasAutoFillError] = useState(false);

  // Initial desired state of our form
  const initialState = useCallback(async () => {
    const datasetId = datasets[0].value;
    const allWidgets = await getAllWidgetsForDataset(datasetId);
    dispatch(modifyOptions({
      dataset: datasets[0].value,
      widgets: allWidgets,
      widget: null
    }));
  }, [datasets, dispatch])

  // If we don't have a dataset when initialising the playground, add the first
  useEffect(() => {
    const patch = async () => {
      await initialState();
    }
    if (!dataset) {
      patch();
    }
  }, []); // eslint-disable-line

  // When autofill value changes apply desired dataset/widget
  // if autofill is empty apply initial state
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (autoFillValue.length > 0) {
        try {
          const response = await fetch(autoFillValue);
          const { data } = await response.json();
          if (data.type === 'widget') {
            const allWidgets = await getAllWidgetsForDataset(data.attributes.dataset);
            dispatch(modifyOptions({
              dataset: data.attributes.dataset,
              widget: data.id,
              widgets: allWidgets
            }))
          }
          if (data.type === 'dataset') {
            const allWidgets = await getAllWidgetsForDataset(data.id);
            dispatch(modifyOptions({
              dataset: data.id,
              widget: null,
              widgets: allWidgets
            }))
          }
          hasAutoFillError(false);
        } catch (e) {
          console.error('(Playground) failed to fetch widgets')
          hasAutoFillError(true);
        }
      }
      if (autoFillValue.length === 0 && prevAutoFillValue.current) {
        await initialState();
      }
      prevAutoFillValue.current = autoFillValue;
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [autoFillValue, datasets, dispatch, initialState])

  // Some selectors for getting the correct dataset and widget
  const dataset = useSelector(state => {
    const { editorOptions: { datasets, dataset } } = state;
    const selected = datasets.find(d => d.value === dataset);
    return selected || '';
  });

  const widget = useSelector(state => {
    const { editorOptions: { widgets, widget } } = state;
    if (!widget) {
      return '';
    }
    const selected = widgets.find(d => d.value === widget);
    return selected || '';
  });

  // If our dataset is not pre-defined, display "custom dataset" in select
  const isCustomDataset = !datasets.find(d => d.value === dataset.value);

  // Event handlers for select inputs
  const handleChangeDataset = async (item, { action }) => {
    const allWidgets = await getAllWidgetsForDataset(item.value);
    dispatch(modifyOptions({
      dataset: item.value,
      widgets: allWidgets
    }))
  }

  const handleChangeWidget = async (item, { action }) => {
    dispatch(modifyOptions({
      widget: item.value
    }))
  }

  return [
    datasets,
    widgets,
    dataset,
    widget,
    isCustomDataset,
    autoFillError,
    handleChangeDataset,
    handleChangeWidget
  ]
}

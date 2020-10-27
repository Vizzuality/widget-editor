import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import './style.scss';

const getAllWidgetsForDataset = async datasetId => {
  const response = await fetch(`https://api.resourcewatch.org/v1/dataset/${datasetId}/widget`);
  const { data } = await response.json();
  return data.map(d => ({
    label: d.attributes.name,
    value: d.id
  }));
}

const EditorForm = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState(false);

  const datasets = useSelector(state => state.editorOptions.datasets);
  const widgets = useSelector(state => state.editorOptions.widgets);

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

  const isCustomDataset = !datasets.find(d => d.value === dataset.value);

  useEffect(() => {
    const patch = async () => {
      const datasetId = datasets[0].value;
      const allWidgets = await getAllWidgetsForDataset(datasetId);
      dispatch(modifyOptions({ dataset: datasets[0].value, widgets: allWidgets }));
    }
    if (!dataset) {
      patch();
    }
  }, []); // eslint-disable-line

  const modifyOptions = payload => ({
    type: 'PLAYGROUND/modifyOptions',
    payload
  });

  const autoFill = async e => {
    const { value } = e.target;
    const response = await fetch(value);
    const { data } = await response.json();

    if (data.type === 'widget') {
      const allWidgets = await getAllWidgetsForDataset(data.attributes.dataset);
      dispatch(modifyOptions({
        dataset: data.attributes.dataset,
        widget: data.id,
        widgets: allWidgets
      }))
    }
  }

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

  return (
    <div
      className={`c-editor-form ${active ? '-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="input">
        <label htmlFor="smart-fill">Auto fill: enter a resoucewatch widget or dataset api endpoint and auto fill details</label>
        <input onChange={autoFill} autoComplete="off" name="smart-fill" className="text-input" type="text" placeholder="Paste here" />
      </div>
      <div className="input">
        <label htmlFor="dataset">Dataset</label>
        <CreatableSelect
          value={isCustomDataset ? { label: 'Custom dataset', value: dataset.value } : dataset}
          onChange={handleChangeDataset}
          name="dataset"
          options={[
            ...datasets,
            (isCustomDataset && { label: 'Custom dataset', value: dataset.value })
          ]}
          isClearable
        />
      </div>
      <div className="input">
        <label htmlFor="widget">Widget</label>
        <Select
          value={widget}
          onChange={handleChangeWidget}
          name="widget"
          options={widgets}
        />
      </div>
    </div>
  )
}

export default EditorForm;

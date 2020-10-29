import React, { useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import useEditorForm from './useEditorForm';

import './style.scss';

const EditorForm = () => {
  const [active, setActive] = useState(false);
  const [autoFillValue, setAutoFillValue] = useState('');

  const [
    datasets,
    widgets,
    dataset,
    widget,
    isCustomDataset,
    autoFillError,
    handleChangeDataset,
    handleChangeWidget
  ] = useEditorForm(autoFillValue);

  const autoFill = async e => {
    const { value } = e.target;
    setAutoFillValue(value);
  }

  const datasetValue = () => {
    if (!dataset) {
      return null;
    }
    if (isCustomDataset) {
      return { label: 'Custom dataset', value: dataset ? dataset.value : '' };
    }
    return dataset || '';
  }

  const datasetOptions = () => {
    return [
      ...datasets,
      (isCustomDataset && dataset && { label: 'Custom dataset', value: dataset.value })
    ]
  }

  return (
    <div
      className={`c-editor-form ${active ? '-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="input">
        <label htmlFor="smart-fill">Auto fill: enter a resoucewatch widget or dataset api endpoint and auto fill details</label>
        <input
          value={autoFillValue}
          onChange={autoFill}
          autoComplete="off"
          className="text-input"
          type="text"
          placeholder="Paste here"
        />
        {autoFillValue.length > 0 && autoFillError && <p className="error">Failed to autofill</p>}
      </div>
      <div className="input">
        <label htmlFor="dataset">Dataset</label>
        <CreatableSelect
          value={datasetValue()}
          onChange={handleChangeDataset}
          name="dataset"
          options={datasetOptions()}
          isClearable
        />
      </div>
      <div className="input">
        <label htmlFor="widget">Widget</label>
        <Select
          value={widget || ''}
          onChange={handleChangeWidget}
          name="widget"
          options={widgets || []}
        />
      </div>
    </div>
  )
}

export default EditorForm;

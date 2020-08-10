import React, { useState } from 'react';
import JSONTree from 'react-json-tree'

import { RiEye2Line, RiCloseLine } from 'react-icons/ri';

import { getEditorState } from "@widget-editor/widget-editor";

import './styles.scss';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

const DebugOptions = () => {
  const [debugJSON, setDebugJSON] = useState(null);
  return <div className="c-debug-options">
    <button type="button" onClick={() => setDebugJSON(getEditorState())}>
      <RiEye2Line /> Get Editor state
    </button>
    {debugJSON && <div className="debug-options--debug-view">
      <header className="debug-options--debug-view--header">
        Get editor state hook result
        <button onClick={() => setDebugJSON(null)}><RiCloseLine /></button>
      </header>
      <div className="debug-options--debug-view--result">
        <JSONTree
          data={debugJSON}
          theme={theme}
          invertTheme={true}
          shouldExpandNode={(_keyName, _data, level) => level <= 2}
        />
      </div>
    </div>}
    {debugJSON && <div className="debug-options--debug-backdrop" />}
  </div>
}

export default DebugOptions;
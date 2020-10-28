import React from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { RiLoginBoxLine, RiMistLine, RiPaletteLine } from 'react-icons/ri';

import DebugOption from "components/debug-options";

const modifyOptions = payload => ({
  type: 'PLAYGROUND/modifyOptions',
  payload
});

const Header = () => {
  const dispatch = useDispatch();
  const renderer = useSelector(state => state.editorOptions.renderer);
  const unmounted = useSelector(state => state.editorOptions.unmounted);

  return (
    <header className="App-header">
      Widget editor
      <div className="App-header--nav">
        <button type="button" onClick={() => dispatch(modifyOptions({ renderer: !renderer }))}>
          {renderer ? <RiMistLine /> : <RiPaletteLine /> } {renderer ? "View editor" : "View renderer"}
        </button>
        <button type="button" onClick={() => dispatch(modifyOptions({ unmounted: !unmounted }))}>
          <RiLoginBoxLine />
          {unmounted && 'Mount editor'}
          {!unmounted && 'Un-mount editor'}
        </button>
        <DebugOption />
      </div>
    </header>
  )
}

export default Header;

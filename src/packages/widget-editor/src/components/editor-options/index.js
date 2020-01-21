import { connectState } from "helpers/redux";

import { patchConfiguration } from "modules/configuration/actions";

import EditorOptionsComponent from './component';

export default connectState(
  (state) => ({
     limit: state.configuration.limit
  }),
  { patchConfiguration }
)(EditorOptionsComponent)  

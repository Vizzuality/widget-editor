import { connectState } from '@widget-editor/shared/lib/helpers/redux';
import { selectFields } from '@widget-editor/shared/lib/modules/editor/selectors';
import { selectEndUserFilters } from '@widget-editor/shared/lib/modules/end-user-filters/selectors';
import { setEndUserFilters } from '@widget-editor/shared/lib/modules/end-user-filters/actions';
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";

import Component from './component';

export default connectState(
  state => ({
    fields: selectFields(state),
    endUserFilters: selectEndUserFilters(state),
  }),
  {
    setEndUserFilters,
    patchConfiguration,
  }
)(Component);
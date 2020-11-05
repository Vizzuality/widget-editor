import { redux } from "@widget-editor/shared";
import { selectAreaIntersection } from "@widget-editor/shared/lib/modules/filters/selectors";
import { setFilters } from "@widget-editor/shared/lib/modules/filters/actions";
import { patchConfiguration } from "@widget-editor/shared/lib/modules/configuration/actions";
import Component from "./component";

export default redux.connectState(
  state => ({
    areaIntersection: selectAreaIntersection(state),
  }),
  {
    setFilters,
    patchConfiguration,
  },
)(Component);

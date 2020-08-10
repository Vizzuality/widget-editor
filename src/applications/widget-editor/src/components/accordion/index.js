import { connectState } from "@widget-editor/shared/lib/helpers/redux";

// Components
import { AccordionSection as UnconnectedAccordionSection } from "./component";

export { Accordion } from "./component";

export const AccordionSection = connectState(
  state => ({ themeColor: state.theme.color })
)(UnconnectedAccordionSection);

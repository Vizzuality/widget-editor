import { all, fork } from "redux-saga/effects";

import editor from "./editor";
import widget from "./widget";

export default function* root() {
  yield all([fork(editor), fork(widget)]);
}

import { all, fork } from "redux-saga/effects";

import editor from "./editor";

export default function* root() {
  yield all([fork(editor)]);
}

import { App } from "./App";
import "symbol-observable";
import { run } from "@cycle/rxjs-run";
import { makeDOMDriver, DOMSource } from "@cycle/dom/lib/cjs/rxjs";

import Snabbdom from "snabbdom-pragma";

// @ts-ignore
window.Snabbdom = Snabbdom;

export interface Source {
  DOM: DOMSource;
}

const drivers = {
  DOM: makeDOMDriver("#app"),
};

run(App, drivers);

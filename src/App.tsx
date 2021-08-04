import "symbol-observable";
import { DOMSource } from "@cycle/dom/lib/cjs/rxjs";
import { LabeledSlide } from "./component/LabeledSlide";
import { of, combineLatest, map } from "rxjs";
import isolate from "@cycle/isolate";
import { mapToRecord } from "./util/mapToRecord";

export interface Source {
  DOM: DOMSource;
}

export function App(sources: Source) {
  const { DOM: widthSlide$, value: width$ } = isolate(LabeledSlide)({
    DOM: sources.DOM,
    props: of({ labelText: "width: " }),
  });
  const { DOM: heightSlide$, value: height$ } = isolate(LabeledSlide)({
    DOM: sources.DOM,
    props: of({ labelText: "height: " }),
  });
  const dom$ = combineLatest([
    mapToRecord({ widthSlide: widthSlide$, width: width$ }),
    mapToRecord({ heightSlide: heightSlide$, height: height$ }),
  ]);
  const sinks = {
    DOM: dom$.pipe(
      map(([{ widthSlide, width }, { heightSlide, height }]) => (
        <div>
          <div>
            width: {width}
            {widthSlide}
          </div>
          <div>
            height: {height}
            {heightSlide}
          </div>
          <div
            style={{
              marginTop: "10px",
              width: `${width}px`,
              height: `${height}px`,
              background: "red",
            }}
          ></div>
        </div>
      ))
    ),
  };
  return sinks;
}

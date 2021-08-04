import "symbol-observable";
import { map, ObservableInput, startWith, Observable } from "rxjs";
import { DOMSource } from "@cycle/dom/lib/cjs/rxjs";
import { mapToRecord } from "../util/mapToRecord";
import isolate from "@cycle/isolate";

export interface Source {
  DOM: DOMSource;
  props?: Observable<{
    labelText?: string;
    value?: number;
  }>;
}

function intent(DOM: DOMSource) {
  const input$: ObservableInput<number> = DOM.select("input")
    .events("input")
    .pipe(
      map((e: MouseEvent) => +(e.target as HTMLInputElement).value),
      startWith(100)
    );
  return {
    input$,
  };
}

function model(actions: ReturnType<typeof intent>, props$?: Source["props"]) {
  const { input$ } = actions;
  return mapToRecord({ value: input$, props: props$ });
}

function view(state$: ReturnType<typeof model>) {
  return state$.pipe(
    map(({ value, props }) => (
      <div style={{ verticalAlign: "center" }}>
        <label>
          {props.labelText}
          <input type={"range"} name="width" value={value} />
        </label>
      </div>
    ))
  );
}

export const LabeledSlide = (sources: Source) => {
  const state$ = model(intent(sources.DOM), sources.props);
  return {
    DOM: view(state$),
    value: state$.pipe(map((item) => item.value)),
  };
};

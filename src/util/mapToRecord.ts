import { Observable, combineLatest, map } from "rxjs";

type GetObservableType<T> = T extends Observable<infer Y> ? Y : never;
type MapToObservableRecord<T> = T extends Record<infer K, any>
  ? Observable<{ [key in K]: GetObservableType<T[key]> }>
  : never;

export function mapToRecord<T extends { [key: string]: Observable<unknown> }>(
  streamCollective: T
): MapToObservableRecord<T> {
  const keys = Object.keys(streamCollective);
  const values = Object.values(streamCollective);
  return combineLatest(values).pipe(
    map((iitem) =>
      iitem.reduce(
        (result: { [key in keyof T]: T[key] }, item, index) => ({
          ...result,
          [keys[index]]: item,
        }),
        {}
      )
    )
  ) as MapToObservableRecord<T>;
}

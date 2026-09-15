import { GridLineV } from "./grid-line-v";

export function GridVerticalGuides() {
  return (
    <>
      <GridLineV className="top-0 bottom-0 left-[calc(25vw-24px)]" />
      <GridLineV className="top-0 bottom-0 right-[calc(25vw-24px)]" />
    </>
  );
}

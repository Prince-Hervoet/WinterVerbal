import rough from "roughjs";

export function makeRoughCanvas(canvasDom: HTMLCanvasElement) {
  return rough.canvas(canvasDom);
}

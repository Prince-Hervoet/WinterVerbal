import { EventCenter } from "../event/eventCenter";
import { Verbal } from "./verbal";
import { VerbalCanvas } from "./verbalCanvas";

export function initCanvas(
  container: HTMLElement,
  width: number,
  height: number
) {
  const renderCanvasDom = document.createElement("canvas");
  const eventCanvasDom = document.createElement("canvas");
  container.setAttribute(
    "style",
    `position: relative; width: ${width}px; height: ${height}px;`
  );

  renderCanvasDom.setAttribute("width", width + "");
  renderCanvasDom.setAttribute("height", height + "");
  eventCanvasDom.setAttribute("width", width + "");
  eventCanvasDom.setAttribute("height", height + "");
  eventCanvasDom.setAttribute("style", `position: absolute; left: 0; top: 0;`);

  const renderCanvas = new VerbalCanvas(renderCanvasDom);
  const eventCanvas = new VerbalCanvas(eventCanvasDom);

  container.appendChild(renderCanvasDom);
  container.appendChild(eventCanvasDom);

  const eventCenter = new EventCenter(
    eventCanvasDom,
    renderCanvas,
    eventCanvas
  );
  return new Verbal(renderCanvas, eventCanvas, eventCenter);
}

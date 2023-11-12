import { CanvasEvent } from "../event/canvasEvent";
import { VerbalWidget } from "../widget/verbalWidget";
import { Canvas } from "./canvas";

export function makeVerbalCanvas(
  container: HTMLElement,
  width: number,
  height: number
) {
  if (!container) return;
  const renderCanvasDom = document.createElement("canvas");
  const eventCanvasDom = document.createElement("canvas");
  container.setAttribute(
    "style",
    `position: relative; width: ${width}px; height: ${height}px;`
  );
  renderCanvasDom.setAttribute("width", width + "");
  renderCanvasDom.setAttribute("height", height + "");
  eventCanvasDom.setAttribute("style", `position: absolute; left: 0; top: 0;`);
  eventCanvasDom.setAttribute("width", width + "");
  eventCanvasDom.setAttribute("height", height + "");
  container.appendChild(renderCanvasDom);
  container.appendChild(eventCanvasDom);
  const renderCanvas = new Canvas(renderCanvasDom);
  const eventCanvas = new Canvas(eventCanvasDom);
  const canvasEvent = new CanvasEvent(container, renderCanvas, eventCanvas);
  return new VerbalCanvas(container, renderCanvas, eventCanvas, canvasEvent);
}

class VerbalCanvas {
  private _container: HTMLElement;
  private _renderCanvas: Canvas;
  private _eventCanvas: Canvas;
  private _canvasEvent: CanvasEvent;

  constructor(
    container: HTMLElement,
    renderCanvas: Canvas,
    eventCanvas: Canvas,
    canvasEvent: CanvasEvent
  ) {
    this._container = container;
    this._eventCanvas = eventCanvas;
    this._renderCanvas = renderCanvas;
    this._canvasEvent = canvasEvent;
  }

  place(...widgets: VerbalWidget[]) {
    this._renderCanvas.place(...widgets);
  }

  remove(...widgets: VerbalWidget[]) {}
}

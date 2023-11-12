import { CanvasEvent, StateEnum } from "./canvasEvent";

export function mouseMoveHandler(event: MouseEvent, canvasEvent: CanvasEvent) {
  switch (canvasEvent.getCanvasState()) {
    case StateEnum.COMMON:
      mouseMoveCommon(event, canvasEvent);
      break;
  }
}

function mouseMoveCommon(event: MouseEvent, canvasEvent: CanvasEvent) {
  const { offsetX, offsetY } = event;
  const widget = canvasEvent.renderCanvas.pointOnWidget(offsetX, offsetY);
  if (widget) {
    canvasEvent.container.setAttribute("style", `cursor: pointer;`);
  } else {
    canvasEvent.container.setAttribute("style", `cursor: default;`);
  }
}

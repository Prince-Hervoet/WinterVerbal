import { judgePointOnShape } from "../util/calculate";
import { CornerStyleName } from "../widget/someTypes";
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
    const cornerPoints = widget.getCornerPoints();
    for (let i = 0; i < cornerPoints.length; ++i) {
      if (judgePointOnShape(offsetX, offsetY, cornerPoints[i])) {
        console.log(i);
        const styleName = (CornerStyleName as any)[i + ""];
        canvasEvent.container.setAttribute("style", `cursor: ${styleName};`);
        break;
      }
    }
  } else {
    canvasEvent.container.setAttribute("style", `cursor: default;`);
  }
}

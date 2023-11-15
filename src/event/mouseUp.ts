import { boxSelectCalPos, boxSelectGroupPos } from "../util/math";
import { placeHittingState, removeHittingState } from "./common";
import { EventCenter, StateEnum } from "./eventCenter";

export function mouseUpHandler(event: MouseEvent, eventCenter: EventCenter) {
  switch (eventCenter.getState()) {
    case StateEnum.COMMON:
      break;
    case StateEnum.DRAGGING:
      mouseUpDragging(event, eventCenter);
      break;
    case StateEnum.CATCHING:
      mouseUpCatching(event, eventCenter);
      break;
    case StateEnum.TRANSFORM:
      mouseUpTransform(event, eventCenter);
      break;
    case StateEnum.BOXSELECT:
      mouseUpBoxSelect(event, eventCenter);
      break;
  }
}

function mouseUpDragging(event: MouseEvent, eventCenter: EventCenter) {
  const dragging = eventCenter.getDragging()!;
  eventCenter.transferToRenderCanvas(dragging);
  eventCenter.setCatching(null);
  eventCenter.setDragging(null);
  eventCenter.setState(StateEnum.HIITING);
}

function mouseUpCatching(event: MouseEvent, eventCenter: EventCenter) {
  eventCenter.setCatching(null);
  eventCenter.setState(StateEnum.HIITING);
}

function mouseUpBoxSelect(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const mouseDownPoint = eventCenter.getMouseDownPoint();
  const { x, y, width, height } = boxSelectCalPos(
    { x: offsetX, y: offsetY },
    mouseDownPoint
  );
  const widgets = eventCenter.getRenderCanvas().judgeBoxSelect([
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ]);
  console.log(widgets);
  eventCenter.getEventCanvas().clear();
  eventCenter.setHovering(null);
  eventCenter.setHitting(null);
  eventCenter.setCatching(null);
  if (widgets.length === 1) {
    eventCenter.setHitting(widgets[0]);
    placeHittingState(widgets[0], eventCenter);
    eventCenter.setState(StateEnum.HIITING);
  } else if (widgets.length > 1) {
    eventCenter.setState(StateEnum.COMMON);
  } else {
    eventCenter.setState(StateEnum.COMMON);
  }
}

function mouseUpTransform(event: MouseEvent, eventCenter: EventCenter) {
  const catching = eventCenter.getCatching()!;
  eventCenter.transferToRenderCanvas(catching);
  eventCenter.setCatching(null);
  eventCenter.setState(StateEnum.HIITING);
}

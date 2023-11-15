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
  eventCenter.getEventCanvas().clear();
  eventCenter.setHovering(null);
  eventCenter.setHitting(null);
  eventCenter.setCatching(null);
  eventCenter.setState(StateEnum.COMMON);
}

function mouseUpTransform(event: MouseEvent, eventCenter: EventCenter) {
  const catching = eventCenter.getCatching()!;
  eventCenter.transferToRenderCanvas(catching);
  eventCenter.setCatching(null);
  eventCenter.setState(StateEnum.HIITING);
}

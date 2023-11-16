import {
  placeHittingState,
  removeHittingState,
  removeHoveringState,
} from "./common";
import { EventCenter, StateEnum } from "./eventCenter";

export function mouseDownHandler(event: MouseEvent, eventCenter: EventCenter) {
  switch (eventCenter.getState()) {
    case StateEnum.COMMON:
      mouseDownCommon(event, eventCenter);
      break;
    case StateEnum.HIITING:
      mouseDownHitting(event, eventCenter);
      break;
  }
}

function mouseDownCommon(event: MouseEvent, eventCenter: EventCenter) {
  const hovering = eventCenter.getHovering();
  if (hovering) {
    eventCenter.setHitting(hovering);
    eventCenter.setCatching(hovering);
    removeHoveringState(eventCenter);
    placeHittingState(hovering, eventCenter);
    const pos = hovering.getBoundingBoxPosition();
    eventCenter.setMouseDownOffset({
      x: event.offsetX - pos.x,
      y: event.offsetY - pos.y,
    });
    eventCenter.setState(StateEnum.CATCHING);
  } else {
    eventCenter.setMouseDownPoint({ x: event.offsetX, y: event.offsetY });
    eventCenter.setState(StateEnum.BOXSELECT);
  }
}

function mouseDownHitting(event: MouseEvent, eventCenter: EventCenter) {
  const transformDir = eventCenter.getTransformDir();
  if (transformDir) {
    eventCenter.setCatching(eventCenter.getHitting());
    eventCenter.setState(StateEnum.CATCHING);
    return;
  }

  const hovering = eventCenter.getHovering();
  if (hovering) {
    if (hovering === eventCenter.getHitting()) {
      eventCenter.setCatching(hovering);
    } else {
      const hitting = eventCenter.getHitting()!;
      removeHittingState(hitting, eventCenter);
      eventCenter.setHitting(hovering);
      eventCenter.setCatching(hovering);
      removeHoveringState(eventCenter);
      placeHittingState(hovering, eventCenter);
      if (hitting.get("shapeName") === "group")
        eventCenter.getRenderCanvas().removeWithoutRender(hitting);
    }
    const pos = hovering.getBoundingBoxPosition();
    eventCenter.setMouseDownOffset({
      x: event.offsetX - pos.x,
      y: event.offsetY - pos.y,
    });
    eventCenter.setState(StateEnum.CATCHING);
  } else {
    eventCenter.setMouseDownPoint({ x: event.offsetX, y: event.offsetY });
    eventCenter.setState(StateEnum.BOXSELECT);
  }
}

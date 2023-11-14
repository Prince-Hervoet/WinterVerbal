import { placeHittingState, removeHittingState } from "./common";
import { EventCenter } from "./eventCenter";

export function mouseDownHandler(event: MouseEvent, eventCenter: EventCenter) {
  const hovering = eventCenter.getHovering();
  if (hovering) {
    if (hovering === eventCenter.getHitting()) {
      eventCenter.setCatching(hovering);
      return;
    }
    removeHittingState(eventCenter.getHitting(), eventCenter);
    eventCenter.setHitting(hovering);
    eventCenter.setCatching(hovering);
    placeHittingState(hovering, eventCenter);
  } else {
    removeHittingState(eventCenter.getHitting(), eventCenter);
    eventCenter.setHitting(null);
  }
}

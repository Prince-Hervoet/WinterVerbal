import { EventCenter } from "./eventCenter";

export function mouseUpHandler(event: MouseEvent, eventCenter: EventCenter) {
  const dragging = eventCenter.getDragging();
  if (dragging) {
  }
}

import { placeHittingState, removeHittingState } from "./common";
import { EventCenter, StateEnum } from "./eventCenter";

export function mouseMoveHandler(event: MouseEvent, eventCenter: EventCenter) {
  switch (eventCenter.getState()) {
    case StateEnum.COMMON:
      mouseMoveCommon(event, eventCenter);
      break;
  }
}

function mouseMoveCommon(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const widget = eventCenter
    .getRenderCanvas()
    .judgePointOnWidget(offsetX, offsetY);
  if (widget) {
    eventCenter.setHovering(widget);
    const oldStyle: string = eventCenter.getEventDom().getAttribute("style")!;
    eventCenter.getEventDom().setAttribute("oldStyle", oldStyle);
    eventCenter.getEventDom().setAttribute("style", oldStyle + `cursor: grab;`);
  } else {
    eventCenter.setHovering(null);
    const oldStyle: string = eventCenter
      .getEventDom()
      .getAttribute("oldStyle")!;
    eventCenter.getEventDom().setAttribute("style", oldStyle);
  }
}

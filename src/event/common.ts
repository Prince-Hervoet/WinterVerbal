import { VerbalWidget } from "../widget/verbalWidget";
import { EventCenter } from "./eventCenter";

export function placeHoveringState(
  target: VerbalWidget,
  eventCenter: EventCenter
) {
  const hoveringFlag = eventCenter.hoveringFlag;
  const pos = target.getBoundingBoxPosition();
  pos.x = pos.x - 2;
  pos.y = pos.y - 2;
  pos.width = pos.width + 4;
  pos.height = pos.height + 4;
  hoveringFlag.update(pos);
  eventCenter.getEventCanvas().place(hoveringFlag);
}

export function removeHoveringState(eventCenter: EventCenter) {
  const hoveringFlag = eventCenter.hoveringFlag;
  eventCenter.getEventCanvas().remove(hoveringFlag);
}

export function placeHittingState(
  target: VerbalWidget,
  eventCenter: EventCenter
) {
  if (!target) return;
  const { x, y, width, height } = target.getBoundingBoxPosition();
  eventCenter.gTransformer.update({
    x: x - 5,
    y: y - 5,
    width: width + 10,
    height: height + 10,
  });
  target.set("transformer", eventCenter.gTransformer);
  const tr = target.getTransformer();
  if (tr) eventCenter.getEventCanvas().place(tr);
}

export function removeHittingState(
  target: VerbalWidget,
  eventCenter: EventCenter
) {
  if (!target) return;
  const tr = target.getTransformer();
  target.set("transformer", null);
  if (tr) eventCenter.getEventCanvas().remove(tr);
}

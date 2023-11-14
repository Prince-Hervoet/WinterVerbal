import { VerbalWidget } from "../widget/verbalWidget";
import { EventCenter } from "./eventCenter";

export function placeHoveringState(
  target: VerbalWidget | null,
  eventCenter: EventCenter
) {}

export function placeHittingState(
  target: VerbalWidget | null,
  eventCenter: EventCenter
) {
  if (!target) return;
  const tr = target.getTransformer();
  if (tr) eventCenter.getEventCanvas().place(tr);
}

export function removeHittingState(
  target: VerbalWidget | null,
  eventCenter: EventCenter
) {
  if (!target) return;
  const tr = target.getTransformer();
  if (tr) eventCenter.getEventCanvas().remove(tr);
}

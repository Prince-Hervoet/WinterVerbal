import { boxSelectCalPos, judgePointOnShape } from "../util/math";
import {
  placeHoveringState,
  removeHittingState,
  removeHoveringState,
} from "./common";
import { EventCenter, StateEnum, TransformDirs } from "./eventCenter";

export function mouseMoveHandler(event: MouseEvent, eventCenter: EventCenter) {
  switch (eventCenter.getState()) {
    case StateEnum.COMMON:
      mouseMoveCommon(event, eventCenter);
      break;
    case StateEnum.HIITING:
      mouseMoveHitting(event, eventCenter);
      break;
    case StateEnum.CATCHING:
      mouseMoveCatching(event, eventCenter);
      break;
    case StateEnum.DRAGGING:
      mouseMoveDragging(event, eventCenter);
      break;
    case StateEnum.TRANSFORM:
      mouseMoveTransform(event, eventCenter);
      break;
    case StateEnum.BOXSELECT:
      mouseMoveBoxSelect(event, eventCenter);
      break;
  }
}

/**
 * 鼠标移动 -- 普通状态
 * 检测悬停部件
 * @param event
 * @param eventCenter
 * @returns
 */
function mouseMoveCommon(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const widget = eventCenter
    .getRenderCanvas()
    .judgePointOnWidget(offsetX, offsetY);
  if (widget) {
    if (widget === eventCenter.getHovering()) return;
    eventCenter.setHovering(widget);
    removeHoveringState(eventCenter);
    placeHoveringState(widget, eventCenter);
  } else {
    eventCenter.setHovering(null);
    removeHoveringState(eventCenter);
  }
}

function mouseMoveHitting(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const hitting = eventCenter.getHitting()!;
  const cornerPoints = hitting.getCornerPoints();
  for (let i = 0; i < cornerPoints.length; ++i) {
    if (judgePointOnShape(offsetX, offsetY, cornerPoints[i])) {
      eventCenter.setTransformDir(TransformDirs[i]);
      return;
    }
  }
  eventCenter.setTransformDir("");
  const widget = eventCenter
    .getRenderCanvas()
    .judgePointOnWidget(offsetX, offsetY);
  if (widget) {
    eventCenter.setHovering(widget);
    if (widget !== eventCenter.getHitting()) {
      removeHoveringState(eventCenter);
      placeHoveringState(widget, eventCenter);
    }
  } else {
    eventCenter.setHovering(null);
    removeHoveringState(eventCenter);
  }
}

function mouseMoveCatching(event: MouseEvent, eventCenter: EventCenter) {
  const widget = eventCenter.getCatching()!;
  const transformDir = eventCenter.getTransformDir();
  if (transformDir) {
    eventCenter.transferToEventCanvas(widget);
    eventCenter.setState(StateEnum.TRANSFORM);
    return;
  }
  eventCenter.setDragging(widget);
  if (widget.get("shapeName") === "group")
    eventCenter.transferToEventCanvas(...widget.get("members"));
  else eventCenter.transferToEventCanvas(widget);
  const { offsetX, offsetY } = event;
  const offset = eventCenter.getMouseDownOffset();
  widget.update({ x: offsetX - offset.x, y: offsetY - offset.y });
  eventCenter.setState(StateEnum.DRAGGING);
}

function mouseMoveDragging(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const widget = eventCenter.getDragging()!;
  const offset = eventCenter.getMouseDownOffset();
  widget.update({ x: offsetX - offset.x, y: offsetY - offset.y });
}

function mouseMoveTransform(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const hitting = eventCenter.getHitting()!;
  const pos = hitting.getBoundingBoxPosition();
  switch (eventCenter.getTransformDir()) {
    case "n-resize":
      if (pos.height + (pos.y - offsetY) <= 1) {
        eventCenter.setTransformDir("s-resize");
        return;
      }
      hitting.update({ y: offsetY, height: pos.height + (pos.y - offsetY) });
      break;
    case "s-resize":
      if (offsetY <= pos.y) {
        eventCenter.setTransformDir("n-resize");
        return;
      }
      hitting.update({ height: offsetY - pos.y });
      break;
    case "w-resize":
      if (pos.width + (pos.x - offsetX) <= 1) {
        eventCenter.setTransformDir("e-resize");
        return;
      }
      hitting.update({ x: offsetX, width: pos.width + (pos.x - offsetX) });
      break;
    case "e-resize":
      if (offsetX <= pos.x) {
        eventCenter.setTransformDir("w-resize");
        return;
      }
      hitting.update({ width: offsetX - pos.x });
      break;
    case "nw-resize":
      hitting.update({
        x: offsetX,
        y: offsetY,
        width: pos.width + (pos.x - offsetX),
        height: pos.height + (pos.y - offsetY),
      });
      break;
    case "ne-resize":
      hitting.update({
        width: offsetX - pos.x,
        y: offsetY,
        height: pos.height + (pos.y - offsetY),
      });
      break;
    case "sw-resize":
      hitting.update({
        x: offsetX,
        width: pos.width + (pos.x - offsetX),
        height: offsetY - pos.y,
      });
      break;
    case "se-resize":
      hitting.update({
        width: offsetX - pos.x,
        height: offsetY - pos.y,
      });
      break;
  }
}

function mouseMoveBoxSelect(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const mouseDownPoint = eventCenter.getMouseDownPoint();
  const { x, y, width, height } = boxSelectCalPos(
    { x: offsetX, y: offsetY },
    { x: mouseDownPoint.x, y: mouseDownPoint.y }
  );
  const boxSelectFlag = eventCenter.boxSelectFlag;
  boxSelectFlag.update({ x, y, width, height });
  eventCenter.getEventCanvas().place(boxSelectFlag);
}

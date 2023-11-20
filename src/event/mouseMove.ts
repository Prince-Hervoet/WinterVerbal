import {
  boxSelectCalPos,
  calVectorDegree,
  degreeToRadian,
  judgePointOnShape,
} from "../util/math";
import { placeHoveringState, removeHoveringState } from "./common";
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
    case StateEnum.DRAWING:
      mouseMoveDrawing(event, eventCenter);
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
    // 如果悬停在了某个部件上
    // 如果这个部件就是之前悬停的那个部件，则不需要做其他工作
    if (widget === eventCenter.getHovering()) return;

    // 如果悬停在了新的部件上，则需要重新设置状态
    eventCenter.setHovering(widget);
    // 移除当前的悬停框
    removeHoveringState(eventCenter);
    // 重新放置悬停框
    placeHoveringState(widget, eventCenter);
  } else {
    // 如果鼠标没有悬停在任何一个部件上，则设置为null
    eventCenter.setHovering(null);
    // 移除悬停框
    removeHoveringState(eventCenter);
  }
}

/**
 * 鼠标在选中状态下移动
 * @param event
 * @param eventCenter
 * @returns
 */
function mouseMoveHitting(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  // 优先判断是否悬停在了变换器位置上，如果是则开启变换
  const hitting = eventCenter.getHitting()!;
  const cornerPoints = hitting.getCornerPoints();
  for (let i = 0; i < cornerPoints.length; ++i) {
    if (judgePointOnShape(offsetX, offsetY, cornerPoints[i])) {
      eventCenter.setTransformDir(TransformDirs[i]);
      return;
    }
  }
  // 如果没有悬停在某个变换器位置上则直接设置为空
  eventCenter.setTransformDir("");

  const widget = eventCenter
    .getRenderCanvas()
    .judgePointOnWidget(offsetX, offsetY);
  if (widget) {
    // 如果鼠标悬停在了部件上，则设置状态
    eventCenter.setHovering(widget);
    if (widget !== eventCenter.getHitting()) {
      // 如果当前悬停的部件是已经被选中的部件，则不再显示悬停框，反之则显示
      removeHoveringState(eventCenter);
      placeHoveringState(widget, eventCenter);
    }
  } else {
    // 如果鼠标没有悬停在任何部件上，则设置状态即可，选中的继续选中不需要改变
    eventCenter.setHovering(null);
    removeHoveringState(eventCenter);
  }
}

/**
 * 鼠标在抓取状态下移动
 * @param event
 * @param eventCenter
 * @returns
 */
function mouseMoveCatching(event: MouseEvent, eventCenter: EventCenter) {
  // 优先判断鼠标是否在变换器上
  const widget = eventCenter.getCatching()!;
  const transformDir = eventCenter.getTransformDir();
  if (transformDir) {
    // 如果是则启动变换
    if (widget.get("shapeName") === "group")
      eventCenter.transferToEventCanvas(...widget.get("members"));
    else eventCenter.transferToEventCanvas(widget);
    eventCenter.setState(StateEnum.TRANSFORM);
    return;
  }
  // 如果鼠标不是在变换器上，则认为是拖拽
  eventCenter.setDragging(widget);
  // 如果是组的拖拽，则需要将组内所有成员都传送到事件层
  if (widget.get("shapeName") === "group")
    eventCenter.transferToEventCanvas(...widget.get("members"));
  else eventCenter.transferToEventCanvas(widget); // 如果不是组，则只需要传送一个部件
  const { offsetX, offsetY } = event;
  // 更新鼠标和部件的偏移量
  const offset = eventCenter.getMouseDownOffset();
  widget.update({ x: offsetX - offset.x, y: offsetY - offset.y });
  eventCenter.setState(StateEnum.DRAGGING);
}

/**
 * 拖拽状态鼠标移动
 * @param event
 * @param eventCenter
 */
function mouseMoveDragging(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const widget = eventCenter.getDragging()!;
  // 获取鼠标点击在部件上的偏移量
  const offset = eventCenter.getMouseDownOffset();
  // 更新部件的位置即可
  widget.update({ x: offsetX - offset.x, y: offsetY - offset.y });
}

/**
 * 鼠标在变换状态下移动
 * @param event
 * @param eventCenter
 * @returns
 */
function mouseMoveTransform(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const hitting = eventCenter.getHitting()!;
  const pos = hitting.getBoundingBoxPosition();
  const originPoints = hitting.getBoundingBoxPoints();
  let flagX, flagY;
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
      flagY = (originPoints[0].y + originPoints[1].y) >> 1;
      hitting.update({
        height: (offsetY - flagY) / Math.cos(degreeToRadian(pos.degree)),
      });
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
      flagX = (originPoints[0].x + originPoints[3].x) >> 1;
      hitting.update({
        width: (offsetX - flagX) / Math.cos(degreeToRadian(pos.degree)),
      });
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
      flagY = (originPoints[0].y + originPoints[1].y) >> 1;
      hitting.update({
        x: offsetX,
        width: pos.width + (pos.x - offsetX),
        height: offsetY - pos.y,
      });
      break;
    case "se-resize":
      flagX = (originPoints[0].x + originPoints[3].x) >> 1;
      flagY = (originPoints[0].y + originPoints[1].y) >> 1;
      const rad = degreeToRadian(pos.degree);
      const tempCos = Math.cos(degreeToRadian(rad));
      hitting.update({
        width: (offsetX - flagX + Math.sin(rad) * (pos.height >> 1)) / tempCos,
        height: (offsetY - flagY - Math.sin(rad) * (pos.width >> 1)) / tempCos,
      });
      break;
    case "grabbing":
      const centerPoint = hitting.getCenterPoint();
      const degree = calVectorDegree(
        { x: 0, y: -1 },
        { x: offsetX - centerPoint.x, y: offsetY - centerPoint.y }
      );
      hitting.update({ degree });
      break;
  }
}

/**
 * 鼠标在框选状态下移动
 * @param event
 * @param eventCenter
 */
function mouseMoveBoxSelect(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const mouseDownPoint = eventCenter.getMouseDownPoint();
  // 用鼠标最后一次按下的位置和当前鼠标位置运算出框选最后的位置信息
  const { x, y, width, height } = boxSelectCalPos(
    { x: offsetX, y: offsetY },
    { x: mouseDownPoint.x, y: mouseDownPoint.y }
  );
  // 获取全局框选框部件
  const boxSelectFlag = eventCenter.boxSelectFlag;
  // 放置框选框部件
  boxSelectFlag.update({ x, y, width, height });
  eventCenter.getEventCanvas().place(boxSelectFlag);
}

function mouseMoveDrawing(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const ctx = eventCenter.getEventCanvas().getCtx();
  ctx.lineTo(offsetX, offsetY);
  ctx.moveTo(offsetX, offsetY);
  ctx.stroke();
}

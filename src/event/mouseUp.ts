import { boxSelectCalPos, boxSelectGroupPos } from "../util/math";
import { Group } from "../widget/group";
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
    case StateEnum.DRAWING:
      break;
  }
}

/**
 * 鼠标在拖拽状态下放开
 * @param event
 * @param eventCenter
 */
function mouseUpDragging(event: MouseEvent, eventCenter: EventCenter) {
  const dragging = eventCenter.getDragging()!;
  // 如果拖拽的是组，则需要将组内所有部件都传送回渲染层
  if (dragging.get("shapeName") === "group")
    eventCenter.transferToRenderCanvas(...dragging.get("members"));
  else eventCenter.transferToRenderCanvas(dragging);
  // 将拖拽中的部件和抓取的部件设置为null
  eventCenter.setCatching(null);
  eventCenter.setDragging(null);
  // 将画布状态恢复到选中状态
  eventCenter.setState(StateEnum.HIITING);
}

/**
 * 鼠标在抓取状态下放开
 * @param event
 * @param eventCenter
 */
function mouseUpCatching(event: MouseEvent, eventCenter: EventCenter) {
  // 鼠标抓取一个部件但是没有其他操作，那么放开只要将抓取的部件设置为null即可
  eventCenter.setCatching(null);
  // 恢复为选中状态
  eventCenter.setState(StateEnum.HIITING);
}

/**
 * 鼠标在框选状态下放开
 * @param event
 * @param eventCenter
 */
function mouseUpBoxSelect(event: MouseEvent, eventCenter: EventCenter) {
  const { offsetX, offsetY } = event;
  const mouseDownPoint = eventCenter.getMouseDownPoint();
  // 计算框选框的位置信息
  const { x, y, width, height } = boxSelectCalPos(
    { x: offsetX, y: offsetY },
    mouseDownPoint
  );
  // 计算框选框框中的所有部件
  const widgets = eventCenter.getRenderCanvas().judgeBoxSelect([
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ]);

  // 清空当前的所有状态，避免影响后面的设置
  // 获取当前选中的部件
  const hitting = eventCenter.getHitting();
  if (hitting) {
    // 如果当前有选中的部件，则清除掉
    removeHittingState(hitting, eventCenter);
    // 如果是组，则还需要把临时组部件从渲染层上删除（放到渲染层是因为要响应事件）
    if (hitting.get("shapeName") === "group")
      eventCenter.getRenderCanvas().removeWithoutRender(hitting);
  }
  // 清空事件层的渲染列表
  eventCenter.getEventCanvas().clear();
  // 设置null
  eventCenter.setHovering(null);
  eventCenter.setHitting(null);
  eventCenter.setCatching(null);

  if (widgets.length === 1) {
    // 如果框中的物体只有一个，那就当成点选处理
    eventCenter.setHitting(widgets[0]);
    // 重新放置选中框
    placeHittingState(widgets[0], eventCenter);
    // 将画布状态设置为选中状态
    eventCenter.setState(StateEnum.HIITING);
  } else if (widgets.length > 1) {
    // 如果框中的部件大于一个，就需要使用临时组
    // 计算临时组的位置信息
    const { x, y, width, height } = boxSelectGroupPos(widgets);
    // 将多个部件传入组中
    const group = new Group({ x, y, width, height, members: widgets });
    // 将临时组设置为当前选中的部件
    eventCenter.setHitting(group);
    // 将这个组添加到渲染层上响应鼠标事件
    eventCenter.getRenderCanvas().add(group);
    // 重新放置选中框
    placeHittingState(group, eventCenter);
    // 将画布设置为选中状态
    eventCenter.setState(StateEnum.HIITING);
  } else {
    // 如果没有框中部件，则直接变成普通状态
    eventCenter.setState(StateEnum.COMMON);
  }
}

/**
 * 鼠标在变换过程中放开
 * @param event
 * @param eventCenter
 */
function mouseUpTransform(event: MouseEvent, eventCenter: EventCenter) {
  // 变换过程中放开则是确定变换结果
  const catching = eventCenter.getCatching()!;
  // 将部件传送回渲染层
  if (catching.get("shapeName") === "group")
    eventCenter.transferToRenderCanvas(...catching.get("members"));
  else eventCenter.transferToRenderCanvas(catching);
  // 将抓取的部件设置为null
  eventCenter.setCatching(null);
  // 将画布恢复成选中状态
  eventCenter.setState(StateEnum.HIITING);
}

function mouseUpDrawing(event: MouseEvent, eventCenter: EventCenter) {
  // 放置自由绘画图形
  // 恢复现场
  const eventCanvas = eventCenter.getEventCanvas();
  const ctx = eventCanvas.getCtx();
  ctx.restore();
}

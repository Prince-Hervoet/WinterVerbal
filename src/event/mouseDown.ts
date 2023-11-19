import {
  placeHittingState,
  removeHittingState,
  removeHoveringState,
} from "./common";
import { EventCenter, StateEnum } from "./eventCenter";

/**
 * 鼠标按下事件处理
 * 鼠标按下的情况：1.正常状态按下  2.已有部件被选中时按下
 * @param event
 * @param eventCenter
 */
export function mouseDownHandler(event: MouseEvent, eventCenter: EventCenter) {
  switch (eventCenter.getState()) {
    case StateEnum.COMMON:
      mouseDownCommon(event, eventCenter);
      break;
    case StateEnum.HIITING:
      mouseDownHitting(event, eventCenter);
      break;
    case StateEnum.FREEDRAW:
      break;
  }
}

/**
 * 鼠标在正常状态下按下
 * @param event
 * @param eventCenter
 */
function mouseDownCommon(event: MouseEvent, eventCenter: EventCenter) {
  const hovering = eventCenter.getHovering();
  if (hovering) {
    // 如果鼠标悬停在了某个部件上，那就将这个部件设置成选中的部件，并将画布状态同步调整为抓取态
    eventCenter.setHitting(hovering);
    eventCenter.setCatching(hovering);
    // 在选中时移除掉悬停框，放上选中框
    removeHoveringState(eventCenter);
    placeHittingState(hovering, eventCenter);
    // 设置鼠标按下时的偏移量，如果后面进行拖拽会用到
    const pos = hovering.getBoundingBoxPosition();
    eventCenter.setMouseDownOffset({
      x: event.offsetX - pos.x,
      y: event.offsetY - pos.y,
    });
    // 设置画布状态为抓取
    eventCenter.setState(StateEnum.CATCHING);
  } else {
    removeHoveringState(eventCenter);
    // 如果鼠标没有悬停在任何一个部件上，那就认为是要框选
    // 设置鼠标按下的坐标，为后面框选框的计算做准备
    eventCenter.setMouseDownPoint({ x: event.offsetX, y: event.offsetY });
    // 设置画布状态为框选
    eventCenter.setState(StateEnum.BOXSELECT);
  }
}

/**
 * 鼠标在选中状态按下
 * @param event
 * @param eventCenter
 * @returns
 */
function mouseDownHitting(event: MouseEvent, eventCenter: EventCenter) {
  // 优先判断鼠标是否按在了变换器的位置上，如果是则启动变换模式
  const transformDir = eventCenter.getTransformDir();
  if (transformDir) {
    eventCenter.setCatching(eventCenter.getHitting());
    eventCenter.setState(StateEnum.CATCHING);
    eventCenter.setMouseDownPoint({ x: event.offsetX, y: event.offsetY });
    return;
  }

  // 如果不是按在变换器的位置上，则可能是要拖拽
  const hovering = eventCenter.getHovering();
  if (hovering) {
    // 鼠标悬停在了某个部件上
    if (hovering === eventCenter.getHitting()) {
      // 如果这个部件就是之前已经选中的部件，则直接将其变成抓取状态即可
      eventCenter.setCatching(hovering);
    } else {
      // 如果按在了一个新的部件上，则需要重新设置选中的状态
      const hitting = eventCenter.getHitting()!;
      // 移除掉当前的选中框
      removeHittingState(hitting, eventCenter);
      // 设置各种选中状态
      eventCenter.setHitting(hovering);
      eventCenter.setCatching(hovering);
      // 移除掉悬停框
      removeHoveringState(eventCenter);
      // 重新放置选中框
      placeHittingState(hovering, eventCenter);

      // 如果之前选中的是一个临时组，则需要将这个临时组从渲染列表中删除
      if (hitting.get("shapeName") === "group")
        eventCenter.getRenderCanvas().removeWithoutRender(hitting);
    }
    // 存储鼠标最后按下的位置和部件的偏移量
    const pos = hovering.getBoundingBoxPosition();
    eventCenter.setMouseDownOffset({
      x: event.offsetX - pos.x,
      y: event.offsetY - pos.y,
    });
    eventCenter.setState(StateEnum.CATCHING);
  } else {
    // 如果当前有部件被选中，但是鼠标按在了一个没有任何部件的地方，则认为是要重新框选
    eventCenter.setMouseDownPoint({ x: event.offsetX, y: event.offsetY });
    eventCenter.setState(StateEnum.BOXSELECT);
  }
}

function mouseDownFreeDraw(event: MouseEvent, eventCenter: EventCenter) {}

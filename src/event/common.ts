import { VerbalWidget } from "../widget/verbalWidget";
import { EventCenter } from "./eventCenter";

/**
 * 放置悬停框操作
 * @param target
 * @param eventCenter
 */
export function placeHoveringState(
  target: VerbalWidget,
  eventCenter: EventCenter
) {
  // 获取全局悬停框
  const hoveringFlag = eventCenter.hoveringFlag;
  // 使用包围盒位置信息
  const pos = target.getBoundingBoxPosition();
  // 控制悬停框依附在图形外边
  pos.x = pos.x - 2;
  pos.y = pos.y - 2;
  pos.width = pos.width + 4;
  pos.height = pos.height + 4;
  hoveringFlag.update(pos);
  eventCenter.getEventCanvas().place(hoveringFlag);
}

/**
 * 移除悬停框
 * @param eventCenter
 */
export function removeHoveringState(eventCenter: EventCenter) {
  const hoveringFlag = eventCenter.hoveringFlag;
  eventCenter.getEventCanvas().remove(hoveringFlag);
}

/**
 * 放置选中框
 * @param target
 * @param eventCenter
 * @returns
 */
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
  // 设置绑定关系
  target.set("transformer", eventCenter.gTransformer);
  const tr = target.getTransformer();
  if (tr) eventCenter.getEventCanvas().place(tr);
}

/**
 * 移除选中框
 * @param target
 * @param eventCenter
 * @returns
 */
export function removeHittingState(
  target: VerbalWidget,
  eventCenter: EventCenter
) {
  if (!target) return;
  const tr = target.getTransformer();
  // 移除绑定关系
  target.set("transformer", null);
  if (tr) eventCenter.getEventCanvas().remove(tr);
}

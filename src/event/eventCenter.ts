import { VerbalCanvas } from "../core/verbalCanvas";
import { Group } from "../widget/group";
import { HoveringBox } from "../widget/hoveringBox";
import { Rectangle } from "../widget/rectangle";
import { Transformer } from "../widget/transformer";
import { Point, VerbalWidget } from "../widget/verbalWidget";
import { mouseDownHandler } from "./mouseDown";
import { mouseMoveHandler } from "./mouseMove";
import { mouseUpHandler } from "./mouseUp";

/**
 * 画布事件状态
 */
export const StateEnum = {
  COMMON: 0,
  HIITING: 1,
  CATCHING: 2,
  DRAGGING: 3,
  BOXSELECT: 4,
  TRANSFORM: 10,
  FREEDRAW: 20,
};

/**
 * 变换类型 -- 从左上角开始顺时针标记，最后一个是顶上的旋转
 */
export const TransformDirs = [
  "nw-resize",
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
  "grabbing",
];

/**
 * 事件中心类 -- 负责画布的总体事件处理
 */
export class EventCenter {
  private eventDom: HTMLElement; // 监听浏览器事件的DOM元素
  private renderCanvas: VerbalCanvas; // 渲染层
  private eventCanvas: VerbalCanvas; // 事件层
  private state: number = StateEnum.COMMON; // 画布当前状态 -- 初始是COMMON
  private hovering: VerbalWidget | null = null; // 当前鼠标悬停的部件
  private hitting: VerbalWidget | null = null; // 当前鼠标选中的部件（不一定一直按着鼠标不妨）
  private catching: VerbalWidget | null = null; // 当前鼠标抓取的部件（一直按着鼠标不放）
  private dragging: VerbalWidget | null = null; // 当前正在拖拽的部件

  private mouseDownPoint: Point = { x: 0, y: 0 }; // 鼠标最后按下的位置
  private mouseDownOffset: Point = { x: 0, y: 0 }; // 鼠标最后按下的位置离部件的偏移量

  private transformDir: string = ""; // 当前变换类型

  /**
   * 全局悬停部件 -- 用于鼠标悬停时的显示
   */
  public hoveringFlag: VerbalWidget = new HoveringBox({
    style: { strokeStyle: "#00BFFF", lineWidth: 2 },
  });

  /**
   * 全局框选部件 -- 用于鼠标框选的显示
   */
  public boxSelectFlag: VerbalWidget = new Rectangle({
    style: { fillStyle: "rgba(0, 0, 255, 0.2)" },
  });

  /**
   * 全局变换器
   */
  public gTransformer: Transformer = new Transformer({});

  /**
   * 全局部件组
   */
  public gGroup: Group = new Group({});

  constructor(
    eventDom: HTMLElement,
    renderCanvas: VerbalCanvas,
    eventCanvas: VerbalCanvas
  ) {
    this.eventDom = eventDom;
    this.renderCanvas = renderCanvas;
    this.eventCanvas = eventCanvas;
    this.bindEvent();
  }

  private bindEvent() {
    this.eventDom.addEventListener("mousemove", (event) => {
      mouseMoveHandler(event, this);
    });

    this.eventDom.addEventListener("mousedown", (event) => {
      mouseDownHandler(event, this);
    });

    this.eventDom.addEventListener("mouseup", (event) => {
      mouseUpHandler(event, this);
    });
  }

  getState() {
    return this.state;
  }

  setState(state: number) {
    this.state = state;
  }

  getRenderCanvas() {
    return this.renderCanvas;
  }

  getEventCanvas() {
    return this.eventCanvas;
  }

  getEventDom() {
    return this.eventDom;
  }

  getHovering() {
    return this.hovering;
  }

  setHovering(widget: VerbalWidget | null) {
    this.hovering = widget;
  }

  getHitting() {
    return this.hitting;
  }

  setHitting(widget: VerbalWidget | null) {
    this.hitting = widget;
  }

  getCatching() {
    return this.catching;
  }

  setCatching(widget: VerbalWidget | null) {
    this.catching = widget;
  }

  getDragging() {
    return this.dragging;
  }

  setDragging(widget: VerbalWidget | null) {
    this.dragging = widget;
  }

  /**
   * 将部件从渲染层传送到事件层 -- 用于事件处理过程中减少渲染层的render次数
   * @param widgets
   */
  transferToEventCanvas(...widgets: VerbalWidget[]) {
    for (const widget of widgets) this.renderCanvas.setIsRender(widget, false);
    this.renderCanvas.renderAll();
    this.eventCanvas.place(...widgets);
  }

  /**
   * 将部件从事件层传送回渲染层 -- 用于事件处理完成时渲染出最终结果
   * @param widgets
   */
  transferToRenderCanvas(...widgets: VerbalWidget[]) {
    for (const widget of widgets) this.renderCanvas.setIsRender(widget, true);
    this.renderCanvas.renderAll();
    this.eventCanvas.remove(...widgets);
  }

  getMouseDownPoint() {
    return this.mouseDownPoint;
  }

  setMouseDownPoint(point: Point) {
    this.mouseDownPoint = point;
  }

  getMouseDownOffset() {
    return this.mouseDownOffset;
  }

  setMouseDownOffset(offset: Point) {
    this.mouseDownOffset = offset;
  }

  getTransformDir() {
    return this.transformDir;
  }

  setTransformDir(dir: string) {
    this.transformDir = dir;
  }
}

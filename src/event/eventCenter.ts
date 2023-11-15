import { VerbalCanvas } from "../core/verbalCanvas";
import { Rectangle } from "../widget/rectangle";
import { Point, VerbalWidget } from "../widget/verbalWidget";
import { mouseDownHandler } from "./mouseDown";
import { mouseMoveHandler } from "./mouseMove";
import { mouseUpHandler } from "./mouseUp";

export const StateEnum = {
  COMMON: 0,
  HIITING: 1,
  CATCHING: 2,
  DRAGGING: 3,
  BOXSELECT: 4,
  TRANSFORM: 10,
};

export const TransformDirs = [
  "nw-resize",
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
];

export class EventCenter {
  private eventDom: HTMLElement;
  private renderCanvas: VerbalCanvas;
  private eventCanvas: VerbalCanvas;
  private state: number = StateEnum.COMMON;
  private hovering: VerbalWidget | null = null;
  private hitting: VerbalWidget | null = null;
  private catching: VerbalWidget | null = null;
  private dragging: VerbalWidget | null = null;

  private mouseDownPoint: Point = { x: 0, y: 0 };
  private mouseDownOffset: Point = { x: 0, y: 0 };

  private transformDir: string = "";

  public hoveringFlag: VerbalWidget = new Rectangle({
    style: { strokeStyle: "#00BFFF", lineWidth: 2 },
  });

  public boxSelectFlag: VerbalWidget = new Rectangle({
    style: { fillStyle: "rgba(0, 0, 255, 0.2)" },
  });

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

  transferToEventCanvas(...widgets: VerbalWidget[]) {
    for (const widget of widgets) this.renderCanvas.setIsRender(widget, false);
    this.renderCanvas.renderAll();
    this.eventCanvas.place(...widgets);
  }

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

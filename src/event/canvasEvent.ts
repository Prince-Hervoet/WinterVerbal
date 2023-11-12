import { Canvas } from "../core/canvas";
import { VerbalWidget } from "../widget/verbalWidget";
import { mouseMoveHandler } from "./mouseMove";

export const StateEnum = {
  COMMON: 0,
};

export class CanvasEvent {
  public container: HTMLElement;
  public renderCanvas: Canvas;
  public eventCanvas: Canvas;
  private canvasState: number = StateEnum.COMMON;
  private hovering: VerbalWidget | null = null;

  constructor(
    container: HTMLElement,
    renderCanvas: Canvas,
    eventCanvas: Canvas
  ) {
    this.container = container;
    this.renderCanvas = renderCanvas;
    this.eventCanvas = eventCanvas;
    this.bindEvent(container);
  }

  public bindEvent(targetDom: HTMLElement) {
    targetDom.addEventListener("mousemove", (event) => {
      mouseMoveHandler(event, this);
    });
    targetDom.addEventListener("mousedown", (event) => {});
    targetDom.addEventListener("mouseup", (event) => {});
  }

  public setCanvasState(state: number) {
    this.canvasState = state;
  }

  public getCanvasState() {
    return this.canvasState;
  }

  public setHovering(widget: VerbalWidget | null) {
    this.hovering = widget;
  }

  public getHovering() {
    return this.hovering;
  }
}

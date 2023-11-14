import { VerbalCanvas } from "../core/verbalCanvas";
import { VerbalWidget } from "../widget/verbalWidget";
import { mouseDownHandler } from "./mouseDown";
import { mouseMoveHandler } from "./mouseMove";

export const StateEnum = {
  COMMON: 0,
  HIITING: 1,
  CATCHING: 2,
  DRAGGING: 3,
  BOXSELECT: 4,
};

export class EventCenter {
  private eventDom: HTMLElement;
  private renderCanvas: VerbalCanvas;
  private eventCanvas: VerbalCanvas;
  private state: number = StateEnum.COMMON;
  private hovering: VerbalWidget | null = null;
  private hitting: VerbalWidget | null = null;
  private catching: VerbalWidget | null = null;
  private dragging: VerbalWidget | null = null;

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
  }

  getState() {
    return this.state;
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

  transferToEventCanvas(widget: VerbalWidget) {
    this.renderCanvas.setIsRender(widget, false);
    this.renderCanvas.renderAll();
    this.eventCanvas.place(widget);
  }

  transferToRenderCanvas(widget: VerbalWidget) {
    this.renderCanvas.setIsRender(widget, true);
    this.renderCanvas.renderAll();
    this.eventCanvas.remove(widget);
  }
}

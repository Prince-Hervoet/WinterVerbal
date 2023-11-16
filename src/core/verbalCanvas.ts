import {
  boxSelectGroupPos,
  boxSelectJudge,
  judgePointOnShape,
} from "../util/math";
import { Point, VerbalWidget } from "../widget/verbalWidget";

export class VerbalCanvas {
  private canvasDom: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private renderList: RenderList;
  private widgetToNode: Map<VerbalWidget, WidgetNode> = new Map();

  constructor(canvasDom: HTMLCanvasElement) {
    this.canvasDom = canvasDom;
    this.canvasCtx = canvasDom.getContext("2d")!;
    this.renderList = new RenderList();
  }

  judgePointOnWidget(x: number, y: number): VerbalWidget | null {
    const head = this.renderList.getHead();
    let cursor = this.renderList.getTail();
    cursor = cursor.prev!;
    while (cursor !== head) {
      if (cursor.isRender) {
        const widget = cursor.widget!;
        if (judgePointOnShape(x, y, widget.getPathPoints())) return widget;
      }
      cursor = cursor.prev!;
    }
    return null;
  }

  judgeBoxSelect(box: Point[]): VerbalWidget[] {
    const ans: VerbalWidget[] = [];
    const head = this.renderList.getHead();
    let cursor = this.renderList.getTail();
    cursor = cursor.prev!;
    while (cursor !== head) {
      if (cursor.isRender) {
        const widget = cursor.widget!;
        if (boxSelectJudge(widget.getBoundingBoxPoints(), box))
          ans.push(widget);
      }
      cursor = cursor.prev!;
    }
    return ans;
  }

  has(widget: VerbalWidget): boolean {
    const node = this.widgetToNode.get(widget);
    if (node && node.isRender) return true;
    return false;
  }

  place(...widgets: VerbalWidget[]) {
    this.add(...widgets);
    this.renderAll();
  }

  add(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      if (!widget) continue;
      let node = this.widgetToNode.get(widget);
      if (node) continue;
      node = new WidgetNode();
      node.widget = widget;
      this.renderList.addLast(node);
      this.widgetToNode.set(widget, node);
    }
  }

  renderAll() {
    this.eraseAll();
    const tail = this.renderList.getTail();
    let cursor = this.renderList.getHead();
    cursor = cursor.next!;
    while (cursor !== tail) {
      if (cursor.isRender) {
        const widget = cursor.widget!;
        widget.render(this.canvasCtx);
      }
      cursor = cursor.next!;
    }
  }

  remove(...widgets: VerbalWidget[]) {
    let isRemove = false;
    for (const widget of widgets) {
      const node = this.widgetToNode.get(widget);
      if (!node) continue;
      isRemove = true;
      this.widgetToNode.delete(widget);
      this.renderList.remove(node);
    }
    if (!isRemove) return;
    this.renderAll();
  }

  removeWithoutRender(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      const node = this.widgetToNode.get(widget);
      if (!node) continue;
      this.widgetToNode.delete(widget);
      this.renderList.remove(node);
    }
  }

  setIsRender(widget: VerbalWidget, isRender: boolean) {
    const node = this.widgetToNode.get(widget);
    if (!node) return;
    node.isRender = isRender;
  }

  clear() {
    this.eraseAll();
    this.renderList.clear();
    this.widgetToNode.clear();
  }

  eraseAll() {
    this.canvasCtx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
  }

  size() {
    return this.widgetToNode.size;
  }
}

class WidgetNode {
  next: WidgetNode | null = null;
  prev: WidgetNode | null = null;
  widget: VerbalWidget | null = null;
  isRender: boolean = true;
}

class RenderList {
  private head: WidgetNode;
  private tail: WidgetNode;

  constructor() {
    this.head = new WidgetNode();
    this.tail = new WidgetNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  addLast(node: WidgetNode) {
    const temp = this.tail.prev!;
    temp.next = node;
    node.prev = temp;
    node.next = this.tail;
    this.tail.prev = node;
  }

  remove(node: WidgetNode) {
    const prevNode = node.prev!;
    const nextNode = node.next!;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }

  clear() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}

import { judgePointOnWidget } from "../util/calculate";
import { VerbalWidget } from "../widget/verbalWidget";

export class Canvas {
  private canvasDom: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private renderList: RenderList;
  private widgetToNode: Map<VerbalWidget, RenderListNode> = new Map();

  constructor(canvasDom: HTMLCanvasElement) {
    this.canvasDom = canvasDom;
    this.canvasCtx = canvasDom.getContext("2d")!;
    this.renderList = new RenderList();
  }

  public pointOnWidget(x: number, y: number): VerbalWidget | null {
    const head = this.renderList.getHead();
    let cursor = this.renderList.getTail();
    cursor = cursor.prev!;
    while (cursor !== head) {
      if (cursor.isActive) {
        const widget = cursor.widget!;
        if (judgePointOnWidget(x, y, widget)) return widget;
      }
      cursor = cursor.prev!;
    }
    return null;
  }

  public place(...widgets: VerbalWidget[]) {
    this.add(...widgets);
    this.renderAll();
  }

  public add(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      let node = this.widgetToNode.get(widget);
      if (node) continue;
      node = new RenderListNode();
      node.widget = widget;
      this.widgetToNode.set(widget, node);
      this.renderList.addLast(node);
    }
  }

  public remove(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      const node = this.widgetToNode.get(widget);
      if (!node) continue;
      this.widgetToNode.delete(widget);
      this.renderList.remove(node);
    }
  }

  public renderAll() {
    this.eraseAll();
    const tail = this.renderList.getTail();
    let cursor = this.renderList.getHead();
    cursor = cursor.next!;
    while (cursor !== tail) {
      if (cursor.isActive) {
        const widget = cursor.widget!;
        widget.render(this.canvasCtx);
      }
      cursor = cursor.next!;
    }
  }

  public eraseAll() {
    this.canvasCtx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height);
  }

  public clearAll() {
    this.eraseAll();
    this.renderList.clear();
  }

  public size() {
    return this.widgetToNode.size;
  }
}

class RenderListNode {
  next: RenderListNode | null = null;
  prev: RenderListNode | null = null;
  widget: VerbalWidget | null = null;
  isActive: boolean = true;
}

class RenderList {
  private head: RenderListNode;
  private tail: RenderListNode;

  constructor() {
    this.head = new RenderListNode();
    this.tail = new RenderListNode();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  addLast(node: RenderListNode) {
    if (!node) return;
    const temp = this.tail.prev!;
    temp.next = node;
    node.prev = temp;
    node.next = this.tail;
    this.tail.prev = node;
  }

  remove(node: RenderListNode) {
    if (!node) return;
    const prevNode = node.prev!;
    const nextNode = node.next!;
    prevNode.next = nextNode;
    nextNode.prev = prevNode;
  }

  clear() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  getHead() {
    return this.head;
  }

  getTail() {
    return this.tail;
  }
}

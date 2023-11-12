import { VerbalWidget } from "../widget/verbalWidget";

export class Canvas {
  private canvasDom: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;

  constructor(canvasDom: HTMLCanvasElement) {
    this.canvasDom = canvasDom;
    this.canvasCtx = canvasDom.getContext("2d")!;
  }

  public place(...widgets: VerbalWidget[]) {}

  public add(...widgets: VerbalWidget[]) {}

  public remove(...widgets: VerbalWidget[]) {}

  public eraseAll() {}

  public clearAll() {}
}

import { VerbalWidget } from "./verbalWidget";

/**
 * 矩形
 */
export class Rect extends VerbalWidget {
  public shapeName: string = "rect";

  _render(canvasCtx: CanvasRenderingContext2D): void {
    if (this.style.fillStyle)
      canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    if (this.style.strokeStyle)
      canvasCtx.strokeRect(this.x, this.y, this.width, this.height);
  }

  _updatePathPoints(): void {
    this.pathPoints = [];
    this.pathPoints.push({ x: this.x, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y + this.height });
    this.pathPoints.push({ x: this.x, y: this.y + this.height });
  }
}

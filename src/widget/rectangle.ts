import { VerbalWidget } from "./verbalWidget";

export class Rectangle extends VerbalWidget {
  shapeName: string = "rectangle";

  protected _render(ctx: CanvasRenderingContext2D) {
    if (this.style.fillStyle)
      ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.style.strokeStyle)
      ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  protected _updatePathPoints() {
    this.pathPoints = [];
    this.pathPoints.push({ x: this.x, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y + this.height });
    this.pathPoints.push({ x: this.x, y: this.y + this.height });
  }
}

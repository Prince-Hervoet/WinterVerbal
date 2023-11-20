import { Point, VerbalWidget } from "./verbalWidget";

export class DrawPath extends VerbalWidget {
  drawPoints: Point[] = [];

  protected _render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    const points = this.drawPoints;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; ++i) {
      ctx.lineTo(points[i].x, points[i].y);
      ctx.moveTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  protected _updatePathPoints(): void {
    this.pathPoints = this.drawPoints;
  }
}

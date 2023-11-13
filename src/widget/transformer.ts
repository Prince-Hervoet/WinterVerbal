import { VerbalWidget } from "./verbalWidget";

export class Transformer extends VerbalWidget {
  public cornerWidth: number = 20;
  public cornerHeight: number = 20;

  constructor(widget: VerbalWidget) {
    super({
      x: widget.get("x"),
      y: widget.get("y"),
      width: widget.getWidth(),
      height: widget.getHeight(),
      degree: widget.get("degree"),
    });
  }

  _render(canvasCtx: CanvasRenderingContext2D): void {
    const widthHalf = this.width >> 1;
    const heightHalf = this.height >> 1;
    const cornerWidthHalf = this.cornerWidth >> 1;
    const cornerHeightHalf = this.cornerHeight >> 1;
    canvasCtx.strokeRect(this.x, this.y, this.width, this.height);
    canvasCtx.fillRect(
      this.x - cornerWidthHalf,
      this.y - cornerHeightHalf,
      this.cornerWidth,
      this.cornerHeight
    );
    // canvasCtx.fillRect(
    //   this.x - cornerWidthHalf + widthHalf,
    //   this.y - cornerHeightHalf,
    //   this.width,
    //   this.height
    // );
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    // canvasCtx.fillRect(this.x, this.y, this.width, this.height);
  }
}

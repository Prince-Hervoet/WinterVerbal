import { VerbalWidget } from "./verbalWidget";

export class CanvasImg extends VerbalWidget {
  shapeName: string = "img";
  src: string = "";
  imgCache: HTMLImageElement | null = null;

  constructor(props: any) {
    super(props);
    this.src = props.src ?? "";
  }

  protected _render(ctx: CanvasRenderingContext2D) {
    if (this.imgCache) {
      ctx.drawImage(this.imgCache, this.x, this.y, this.width, this.height);
    } else {
      // 如果没有缓存，则重新加载
      const img = new Image();
      img.src = this.src;
      img.onload = () => {
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
        this.imgCache = img;
      };
    }
  }

  protected _updateBefore(props: any) {
    if (props.src && props.src !== this.src) {
      this.imgCache = null;
      this.src = props.src;
    }
  }

  protected _updatePathPoints() {
    this.pathPoints = [];
    this.pathPoints.push({ x: this.x, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y + this.height });
    this.pathPoints.push({ x: this.x, y: this.y + this.height });
  }
}

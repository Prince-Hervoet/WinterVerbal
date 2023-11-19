import { pointRotateTo } from "../util/math";
import { VerbalWidget } from "./verbalWidget";

export class Transformer extends VerbalWidget {
  cornerWidth: number = 10;
  cornerHeight: number = 10;
  padding: number = 5;

  style: any = { fillStyle: "#00BFFF", strokeStyle: "#00BFFF" };

  constructor(props: any) {
    super(props);
    this.cornerWidth = props.cornerWidth ?? this.cornerWidth;
    this.cornerHeight = props.cornerHeight ?? this.cornerHeight;
    this.padding = props.padding ?? this.padding;
    this.width = this.width + this.padding * 2;
    this.height = this.height + this.padding * 2;
  }

  update(props: any): void {
    this._initProps(props); // 将新值赋到对象上
    this._updateBoundingBoxPoints(); // 更新包围盒点
    this._updateCenterPoint();
    const self = this;
    this.emit("_update_watch", {
      target: self,
    });
  }

  protected _render(ctx: CanvasRenderingContext2D) {
    const widthHalf = this.width >> 1;
    const heightHalf = this.height >> 1;
    const cornerWidthHalf = this.cornerWidth >> 1;
    const cornerHeightHalf = this.cornerHeight >> 1;
    const dirs = [
      [0, 0],
      [widthHalf, 0],
      [this.width, 0],
      [this.width, heightHalf],
      [this.width, this.height],
      [widthHalf, this.height],
      [0, this.height],
      [0, heightHalf],
    ];
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    for (let i = 0; i < dirs.length; ++i) {
      const nx = this.x + dirs[i][0];
      const ny = this.y + dirs[i][1];
      ctx.fillRect(
        nx - cornerWidthHalf,
        ny - cornerHeightHalf,
        this.cornerWidth,
        this.cornerHeight
      );
    }
    ctx.fillRect(
      this.x + widthHalf - cornerWidthHalf,
      this.y - 30,
      this.cornerWidth,
      this.cornerHeight
    );
  }
}

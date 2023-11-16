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
    this.x = this.x - this.padding;
    this.y = this.y - this.padding;
    this.width = this.width + this.padding * 2;
    this.height = this.height + this.padding * 2;
  }

  protected _updateAfter(props: any) {
    this.x = this.x - this.padding;
    this.y = this.y - this.padding;
    this.width = this.width + (this.padding << 1);
    this.height = this.height + (this.padding << 1);
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
      const x = this.x + dirs[i][0];
      const y = this.y + dirs[i][1];
      ctx.fillRect(
        x - cornerWidthHalf,
        y - cornerHeightHalf,
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

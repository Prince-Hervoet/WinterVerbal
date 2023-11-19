import { VerbalWidget } from "./verbalWidget";

/**
 * 悬停框类
 */
export class HoveringBox extends VerbalWidget {
  shapeName: string = "hoveringBox";
  style: any = { strokeStyle: "#00BFFF", lineWidth: 2 };

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
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

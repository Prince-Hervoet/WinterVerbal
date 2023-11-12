import { degreeToAngle, pointRotate } from "../util/calculate";
import { Point } from "./someTypes";
import { Transformer } from "./transformer";

export interface EventCenter {
  on(name: string, handler: Function): void;
  emit(name: string, args: any): void;
  delete(name: string): void;
}

export abstract class VerbalWidget implements EventCenter {
  public widgetId: string = "--";
  public shapeName: string = "unknown";
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public centerX: number = 0;
  public centerY: number = 0;
  public degree: number = 0;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public pathPoints: Point[] = [];
  public cornerPoints: Point[][] = [];
  public boundingBoxPoints: Point[] = [];
  public eventObject: any = {};
  public style: any = {};
  public transformer: VerbalWidget | null = null;
  public showTransformer: boolean = false;

  constructor(props: any) {
    const self: any = this;
    const keys = Object.keys(props);
    for (const key of keys) {
      self[key] = props[key] ?? self[key];
    }
    this._updatePathPoints();
    this._updateCornerPoints();
    this._updateBoundingBoxPoints();
    this._updateCenterPoint();
  }

  on(name: string, handler: Function): void {
    if (!this.eventObject[name]) this.eventObject[name] = [];
    this.eventObject[name].push(handler);
  }

  emit(name: string, args: any): void {
    if (!this.eventObject[name]) return;
    const arr = this.eventObject[name];
    arr.forEach((func: Function) => {
      func(args);
    });
  }

  delete(name: string): void {
    if (!this.eventObject[name]) return;
    this.eventObject[name] = [];
  }

  render(canvasCtx: CanvasRenderingContext2D) {
    if (this.width === 0 || this.height === 0) return;
    canvasCtx.save();
    this._transform(canvasCtx);
    this._setCtxStyle(canvasCtx);
    this._render(canvasCtx);
    if (this.transformer) this.transformer._render(canvasCtx);
    canvasCtx.restore();
  }

  update(props: any) {
    const self: any = this;
    const keys = Object.keys(self);
    for (const key of keys) {
      self[key] = props[key] ?? self[key];
    }
    this._updatePathPoints();
    this._updateCornerPoints();
    this._updateBoundingBoxPoints();
    this._updateCenterPoint();
    const target = this;
    this.emit("_widget_update", { target, event: "_widget_update" });
  }

  setTransformerActive(isActive: boolean) {
    this.showTransformer = isActive;
  }

  getPathPoints(): Point[] {
    return this.pathPoints;
  }

  getBoundingBoxPoints(): Point[] {
    return [];
  }

  getWidth() {
    return this.width * this.scaleX;
  }

  getHeight() {
    return this.height * this.scaleY;
  }

  /**
   * 更新路径顶点数组
   */
  _updatePathPoints() {}

  /**
   * 更新控制角顶点数组
   */
  _updateCornerPoints() {
    const cornerWidth = this.style.cornerWidth ?? 10;
    const cornerWidthHalf = cornerWidth >> 1;
    const cornerHeight = this.style.cornerHeight ?? 10;
    const cornerHeightHalf = cornerHeight >> 1;
    // 左上
    this.cornerPoints[0] = [];
    this.cornerPoints[0].push(
      pointRotate(
        this.x - cornerWidthHalf,
        this.y - cornerHeightHalf,
        this.centerX,
        this.centerY,
        this.degree
      ),
      pointRotate(
        this.x - cornerWidthHalf + cornerWidth,
        this.y - cornerHeightHalf,
        this.centerX,
        this.centerY,
        this.degree
      ),
      pointRotate(
        this.x - cornerWidthHalf + cornerWidth,
        this.y - cornerHeightHalf + cornerHeight,
        this.centerX,
        this.centerY,
        this.degree
      ),
      pointRotate(
        this.x - cornerWidthHalf,
        this.y - cornerHeightHalf + cornerHeight,
        this.centerX,
        this.centerY,
        this.degree
      )
    );
  }

  /**
   * 更新包围盒顶点数组
   */
  _updateBoundingBoxPoints() {}

  /**
   * 更新中心点
   */
  _updateCenterPoint() {
    this.centerX = this.x + (this.width >> 1);
    this.centerY = this.y + (this.height >> 1);
  }

  /**
   * 设置ctx风格
   * @param canvasCtx
   */
  _setCtxStyle(canvasCtx: CanvasRenderingContext2D) {
    const target: any = canvasCtx;
    const keys = Object.keys(this.style);
    for (const key of keys) {
      target[key] = this.style[key] ?? target[key];
    }
  }

  /**
   * 子类绘制方法
   * @param canvasCtx
   */
  _render(canvasCtx: CanvasRenderingContext2D) {}

  /**
   * 变换方法
   * @param canvasCtx
   */
  _transform(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.scale(this.scaleX, this.scaleY); // 缩放
    canvasCtx.translate(this.centerX, this.centerY);
    canvasCtx.rotate(degreeToAngle(this.degree)); // 旋转
    canvasCtx.translate(-this.centerX, -this.centerY);
  }
}

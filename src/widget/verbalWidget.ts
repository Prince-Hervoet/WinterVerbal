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
  public transformerStyle: any = {};
  public transformer: VerbalWidget | null = null;
  public showTransformer: boolean = true;

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
    this._setCtxStyle(this.style, canvasCtx);
    this._render(canvasCtx);
    this._setCtxStyle(this.transformerStyle, canvasCtx);
    if (this.showTransformer) this._renderTransformer(canvasCtx);
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

  getCornerPoints() {
    return this.cornerPoints;
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

  get(name: string) {
    const self: any = this;
    return self[name];
  }

  /**
   * 更新路径顶点数组
   */
  _updatePathPoints() {}

  /**
   * 更新控制角顶点数组
   */
  _updateCornerPoints() {
    const cornerWidth = this.style.cornerWidth ?? 20;
    const cornerWidthHalf = cornerWidth >> 1;
    const cornerHeight = this.style.cornerHeight ?? 20;
    const cornerHeightHalf = cornerHeight >> 1;
    const width = this.getWidth();
    const height = this.getHeight();
    const widthHalf = width >> 1;
    const heightHalf = height >> 1;
    const dirs = [
      [0, 0],
      [widthHalf, 0],
      [width, 0],
      [width, heightHalf],
      [width, height],
      [widthHalf, height],
      [0, height],
      [0, heightHalf],
    ];
    for (let i = 0; i < 8; ++i) {
      this.cornerPoints[i] = [];
      const x = this.x + dirs[i][0];
      const y = this.y + dirs[i][1];
      this.cornerPoints[i].push(
        pointRotate(
          x - cornerWidthHalf,
          y - cornerHeightHalf,
          this.centerX,
          this.centerY,
          this.degree
        ),
        pointRotate(
          x + cornerWidthHalf,
          y - cornerHeightHalf,
          this.centerX,
          this.centerY,
          this.degree
        ),
        pointRotate(
          x + cornerWidthHalf,
          y + cornerHeightHalf,
          this.centerX,
          this.centerY,
          this.degree
        ),
        pointRotate(
          x - cornerWidthHalf,
          y + cornerHeightHalf,
          this.centerX,
          this.centerY,
          this.degree
        )
      );
    }
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
  _setCtxStyle(style: any, canvasCtx: CanvasRenderingContext2D) {
    const target: any = canvasCtx;
    const keys = Object.keys(style);
    for (const key of keys) {
      target[key] = style[key] ?? target[key];
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

  _renderTransformer(canvasCtx: CanvasRenderingContext2D) {
    const cornerWidth = this.style.cornerWidth ?? 20;
    const cornerWidthHalf = cornerWidth >> 1;
    const cornerHeight = this.style.cornerHeight ?? 20;
    const cornerHeightHalf = cornerHeight >> 1;
    const width = this.getWidth();
    const height = this.getHeight();
    const widthHalf = width >> 1;
    const heightHalf = height >> 1;
    const dirs = [
      [0, 0],
      [widthHalf, 0],
      [width, 0],
      [width, heightHalf],
      [width, height],
      [widthHalf, height],
      [0, height],
      [0, heightHalf],
    ];
    canvasCtx.strokeRect(this.x, this.y, width, height);
    for (let i = 0; i < 8; ++i) {
      const x = this.x + dirs[i][0];
      const y = this.y + dirs[i][1];
      canvasCtx.fillRect(
        x - cornerWidthHalf,
        y - cornerHeightHalf,
        cornerWidth,
        cornerHeight
      );
    }
    canvasCtx.fillRect(this.x + dirs[1][0], this.y + dirs[1][1], 0.5, -50);
    canvasCtx.fillRect(
      this.x + dirs[1][0] - cornerWidthHalf,
      this.y + dirs[1][1] - 50 - cornerHeightHalf,
      cornerWidth,
      cornerHeight
    );
  }
}

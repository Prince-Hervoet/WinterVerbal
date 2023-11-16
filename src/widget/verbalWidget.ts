import { degreeToAngle, pointRotateTo } from "../util/math";
import { Transformer } from "./transformer";

/**
 * 点类
 */
export class Point {
  x: number = 0;
  y: number = 0;
}

/**
 * 基本事件触发接口
 */
interface EventApi {
  on(name: string, handler: Function): void;
  emit(name: string, args: any): void;
  delete(name: string): void;
}

export abstract class VerbalWidget implements EventApi {
  // 包围盒基本信息
  x: number = 0;
  y: number = 0;
  centerX: number = 0;
  centerY: number = 0;
  width: number = 0;
  height: number = 0;

  // 变换信息
  scaleX: number = 1;
  scaleY: number = 1;
  degree: number = 0;

  // 点数组
  pathPoints: Point[] = []; // 图形路径顶点数组 -- 用于判断点击等事件
  cornerPoints: Point[][] = []; // 控制角顶点数组 -- 一共九个控制点，用于控制变换
  boundingBoxPoints: Point[] = []; // 包围盒顶点数组 -- 用于框选等重叠计算

  shapeName: string = "--"; // 图形类型名称

  eventObject: any = {}; // 事件处理器数组对象

  transformer: Transformer | null = null; // 该部件携带的变换器

  style: any = { fillStyle: "blue" };

  transformerStyle: any = { fillStyle: "#8DEEEE" };

  constructor(props: any) {
    this._initProps(props);
    this._updateCenterPoint();
    this._updatePathPoints();
    this._updateCornerPoints();
    this._updateTransformer();
  }

  on(name: string, handler: Function): void {
    if (!this.eventObject[name]) this.eventObject[name] = [];
    this.eventObject[name].push(handler);
  }

  emit(name: string, args: any): void {
    const handlers = this.eventObject[name];
    if (!handlers) return;
    handlers.forEach((handler: Function) => {
      handler.call(this, args);
    });
  }

  delete(name: string): void {
    this.eventObject[name] = [];
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.width === 0 || this.height === 0) return;
    ctx.save();
    this._transform(ctx);
    this._setStyle(ctx);
    this._render(ctx);
    ctx.restore();
  }

  update(props: any) {
    this._updateBefore(props);
    this._initProps(props);
    this._updateCenterPoint();
    this._updatePathPoints();
    this._updateCornerPoints();
    this._updateTransformer();
    this._updateAfter(props);
    const self = this;
    this.emit("_update_watch", {
      target: self,
    });
  }

  set(key: string, value: any) {
    const self: any = this;
    self[key] = value;
  }

  get(key: string) {
    const self: any = this;
    return self[key];
  }

  getPathPoints() {
    return this.pathPoints;
  }

  getCornerPoints() {
    return this.cornerPoints;
  }

  getTransformer() {
    return this.transformer;
  }

  getBoundingBoxPosition() {
    return {
      x: this.x,
      y: this.y,
      width: this.width * this.scaleX,
      height: this.height * this.scaleY,
      degree: this.degree,
    };
  }

  getBoundingBoxPoints(): Point[] {
    return [
      pointRotateTo(
        { x: this.x, y: this.y },
        { x: this.centerX, y: this.centerY },
        this.degree
      ),
      pointRotateTo(
        { x: this.x + this.width, y: this.y },
        { x: this.centerX, y: this.centerY },
        this.degree
      ),
      pointRotateTo(
        { x: this.x + this.width, y: this.y + this.height },
        { x: this.centerX, y: this.centerY },
        this.degree
      ),
      pointRotateTo(
        { x: this.x, y: this.y + this.height },
        { x: this.centerX, y: this.centerY },
        this.degree
      ),
    ];
  }

  stringify(): string {
    const info = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      centerX: this.centerX,
      centerY: this.centerY,
      shapeName: this.shapeName,
      degree: this.degree,
      style: this.style,
      transformerStyle: this.transformerStyle,
    };
    return JSON.stringify(info);
  }

  protected _initProps(props: any) {
    const self: any = this;
    const keys: string[] = Object.keys(props);
    keys.forEach((key) => {
      self[key] = props[key] ?? self[key];
    });
  }

  protected _render(ctx: CanvasRenderingContext2D) {}

  protected _transform(ctx: CanvasRenderingContext2D) {
    if (this.degree !== 0) {
      ctx.translate(this.centerX, this.centerY);
      ctx.rotate(degreeToAngle(this.degree));
      ctx.translate(-this.centerX, -this.centerY);
    }
  }

  protected _updateAfter(props: any) {}

  protected _updateBefore(props: any) {}

  protected _setStyle(ctx: CanvasRenderingContext2D) {
    const style: any = this.style;
    const target: any = ctx;
    const keys: string[] = Object.keys(style);
    keys.forEach((key) => {
      target[key] = style[key] ?? target[key];
    });
  }

  protected _updateCenterPoint() {
    const width = this.width * this.scaleX;
    const height = this.height * this.scaleY;
    this.centerX = this.x + (width >> 1);
    this.centerY = this.y + (height >> 1);
  }

  protected _updateCornerPoints() {
    const padding = this.transformerStyle.padding ?? 5;
    const x = this.x - padding,
      y = this.y - padding;
    const width = this.width + (padding << 1),
      height = this.height + (padding << 1),
      widthHalf = width >> 1,
      heightHalf = height >> 1;
    const cornerWidth = this.transformerStyle.cornWidth ?? 10;
    const cornerHeight = this.transformerStyle.cornHeight ?? 10;
    const cornerWidthHalf = cornerWidth >> 1;
    const cornerHeightHalf = cornerHeight >> 1;
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
    for (let i = 0; i < dirs.length; ++i) {
      this.cornerPoints[i] = [];
      const nx = x + dirs[i][0] - cornerWidthHalf,
        ny = y + dirs[i][1] - cornerHeightHalf;
      this.cornerPoints[i].push({ x: nx, y: ny });
      this.cornerPoints[i].push({ x: nx + cornerWidth, y: ny });
      this.cornerPoints[i].push({ x: nx + cornerWidth, y: ny + cornerHeight });
      this.cornerPoints[i].push({ x: nx, y: ny + cornerHeight });
    }
  }

  protected _updateTransformer() {
    if (this.transformer)
      this.transformer.update({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        degree: this.degree,
        style: this.transformerStyle,
      });
  }

  protected _updateBoundingBoxPoints() {}

  protected _updatePathPoints() {}
}

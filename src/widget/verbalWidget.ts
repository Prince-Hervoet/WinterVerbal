import { degreeToRadian, pointRotateTo as rotatePoint } from "../util/math";
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

/**
 * 基本抽象部件
 */
export abstract class VerbalWidget implements EventApi {
  // 包围盒基本信息
  x: number = 0; // left
  y: number = 0; // top
  basePoint: Point = { x: 0, y: 0 }; // 变换基点
  centerPoint: Point = { x: 0, y: 0 }; // 中心点信息
  width: number = 0; // 宽度
  height: number = 0; // 高度

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

  transformer: Transformer | null = null; // 该部件携带的变换器，如果被设置了这个属性，后面更新的时候会同步更新变换器部件

  style: any = { fillStyle: "blue" }; // 绘制风格

  transformerStyle: any = { padding: 5, fillStyle: "#8DEEEE" };

  constructor(props: any) {
    this._initProps(props);
    this._updatePathPoints();
    this._updateCornerPoints();
    this._updateBoundingBoxPoints();
    this._updateCenterPoint();
  }

  protected _render(ctx: CanvasRenderingContext2D) {}

  protected _update(props: any) {}

  protected _updateAfter(props: any) {}

  protected _updateBefore(props: any) {}

  protected _updatePathPoints() {}

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

  /**
   * 统一绘制方法
   * @param ctx
   * @returns
   */
  render(ctx: CanvasRenderingContext2D) {
    if (this.width === 0 || this.height === 0) return;
    ctx.save();
    this._transform(ctx);
    this._setStyle(ctx);
    this._render(ctx);
    ctx.restore();
  }

  /**
   * 统一更新方法
   * @param props
   */
  update(props: any) {
    const oldDegree = this.degree;
    this._initProps(props); // 将新值赋到对象上
    if (this.degree !== 0 && (props.width || props.height)) {
      // 如果当前图形有旋转，并且更新了宽高，那么需要重新计算旋转中心
      let { width, height } = props;
      width = width ?? this.width;
      height = height ?? this.height;
      let nPoint = { x: this.x + (width >> 1), y: this.y + (height >> 1) };
      nPoint = rotatePoint(nPoint, this.centerPoint, oldDegree);
      this.x = nPoint.x - (width >> 1);
      this.y = nPoint.y - (height >> 1);
    }
    this._updateBoundingBoxPoints(); // 更新包围盒点
    this._updateCenterPoint(); // 更新中心点
    this._updatePathPoints(); // 更新路径点
    this._updateCornerPoints(); // 更新控制角点
    this._updatePointsRotate(); // 将点数组进行旋转调整
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
      width: this.width,
      height: this.height,
      degree: this.degree,
    };
  }

  getCenterPoint() {
    return this.centerPoint;
  }

  getBoundingBoxPoints(): Point[] {
    return this.boundingBoxPoints;
  }

  getWidth() {
    return this.width * this.scaleX;
  }

  getHeight() {
    return this.height * this.scaleY;
  }

  stringify(): string {
    const info = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      centerPoint: this.centerPoint,
      shapeName: this.shapeName,
      degree: this.degree,
      style: this.style,
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

  protected _transform(ctx: CanvasRenderingContext2D) {
    if (this.degree !== 0) {
      ctx.translate(this.centerPoint.x, this.centerPoint.y);
      ctx.rotate(degreeToRadian(this.degree));
      ctx.translate(-this.centerPoint.x, -this.centerPoint.y);
    }
  }

  protected _setStyle(ctx: CanvasRenderingContext2D) {
    const style: any = this.style;
    const target: any = ctx;
    const keys: string[] = Object.keys(style);
    keys.forEach((key) => {
      target[key] = style[key] ?? target[key];
    });
  }

  protected _updateCenterPoint() {
    this.centerPoint.x = this.x + (this.width >> 1);
    this.centerPoint.y = this.y + (this.height >> 1);
    // console.log(this.centerPoint);
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

    this.cornerPoints[8] = [];
    this.cornerPoints[8].push({
      x: x + widthHalf - cornerWidthHalf,
      y: y - 30,
    });
    this.cornerPoints[8].push({
      x: x + widthHalf + cornerWidthHalf,
      y: y - 30,
    });
    this.cornerPoints[8].push({
      x: x + widthHalf + cornerWidthHalf,
      y: y - 30 + cornerHeight,
    });
    this.cornerPoints[8].push({
      x: x + widthHalf - cornerWidthHalf,
      y: y - 30 + cornerHeight,
    });
  }

  protected _updateTransformer() {
    if (this.transformer) {
      this.transformer.update({
        x: this.x - 5,
        y: this.y - 5,
        width: this.width + 10,
        height: this.height + 10,
        degree: this.degree,
      });
    }
  }

  protected _updateBoundingBoxPoints() {
    this.boundingBoxPoints = [];
    this.boundingBoxPoints.push({ x: this.x, y: this.y });
    this.boundingBoxPoints.push({ x: this.x + this.width, y: this.y });
    this.boundingBoxPoints.push({
      x: this.x + this.width,
      y: this.y + this.height,
    });
    this.boundingBoxPoints.push({ x: this.x, y: this.y + this.height });
  }

  protected _updatePointsRotate() {
    const ps1 = this.pathPoints;
    for (let i = 0; i < ps1.length; ++i) {
      ps1[i] = rotatePoint(ps1[i], this.centerPoint, this.degree);
    }

    const ps2 = this.cornerPoints;
    for (const points of ps2) {
      for (let i = 0; i < points.length; ++i) {
        points[i] = rotatePoint(points[i], this.centerPoint, this.degree);
      }
    }

    const ps3 = this.boundingBoxPoints;
    for (let i = 0; i < ps3.length; ++i) {
      ps3[i] = rotatePoint(ps3[i], this.centerPoint, this.degree);
    }
  }
}

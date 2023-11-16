import { Point, VerbalWidget } from "../widget/verbalWidget";

/**
 * 判断点是否在图形中
 * @param x
 * @param y
 * @param points
 */
export function judgePointOnShape(x: number, y: number, points: Point[]) {
  let count = 0;
  for (let i = 0; i < points.length; ++i) {
    const nextIndex = i + 1 >= points.length ? 0 : i + 1;
    const px1 = points[i].x;
    const px2 = points[nextIndex].x;
    if (px1 < x && px2 < x) continue;
    const py1 = points[i].y;
    const py2 = points[nextIndex].y;
    if ((py1 < y && py2 > y) || (py1 > y && py2 < y)) ++count;
  }
  return (count & 1) === 1;
}

/**
 * 角度转弧度
 * @param degree
 * @returns
 */
export function degreeToAngle(degree: number) {
  return (degree * Math.PI) / 180;
}

/**
 * 框选区域位置计算
 * @param p1
 * @param p2
 * @returns
 */
export function boxSelectCalPos(p1: Point, p2: Point) {
  const x = Math.min(p1.x, p2.x),
    y = Math.min(p1.y, p2.y);
  const width = Math.max(p1.x, p2.x) - x,
    height = Math.max(p1.y, p2.y) - y;
  return { x, y, width, height };
}

export function pointRotateTo(p: Point, op: Point, degree: number) {
  const x =
    (p.x - op.x) * Math.cos(degree) - (p.y - op.y) * Math.sin(degree) + op.x;
  const y =
    (p.x - op.x) * Math.sin(degree) + (p.y - op.y) * Math.cos(degree) + op.y;
  return { x, y };
}

/**
 * 判断框选重叠情况
 * @param target 目标矩形 -- 可能有旋转
 * @param box 框选框 -- 不会有旋转
 */
export function boxSelectJudge(target: Point[], box: Point[]) {
  for (const point of target) {
    if (point.x < box[0].x || point.x > box[1].x) return false;
    if (point.y < box[0].y || point.y > box[2].y) return false;
  }
  return true;
}

export function boxSelectGroupPos(widgets: VerbalWidget[]) {
  const p1: Point[] = widgets[0].getBoundingBoxPoints();
  let xmin = p1[0].x,
    xmax = p1[0].x,
    ymin = p1[0].y,
    ymax = p1[0].y;
  for (let i = 1; i < p1.length; ++i) {
    xmin = Math.min(xmin, p1[i].x);
    xmax = Math.max(xmax, p1[i].x);
    ymin = Math.min(ymin, p1[i].y);
    ymax = Math.max(ymax, p1[i].y);
  }
  for (let i = 1; i < widgets.length; ++i) {
    const p = widgets[i].getBoundingBoxPoints();
    for (const point of p) {
      xmin = Math.min(xmin, point.x);
      xmax = Math.max(xmax, point.x);
      ymin = Math.min(ymin, point.y);
      ymax = Math.max(ymax, point.y);
    }
  }
  return { x: xmin, y: ymin, width: xmax - xmin, height: ymax - ymin };
}

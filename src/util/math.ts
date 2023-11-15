import { Point } from "../widget/verbalWidget";

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

export function boxSelectCalPos(p1: Point, p2: Point) {
  const x = Math.min(p1.x, p2.x),
    y = Math.min(p1.y, p2.y);
  const width = Math.max(p1.x, p2.x) - x,
    height = Math.max(p1.y, p2.y) - y;
  return { x, y, width, height };
}

import { initCanvas } from "./core/initCanvas";
import { calVectorDegree, fourFiveTo, pointRotateTo } from "./util/math";
import { CanvasImg } from "./widget/canvasImg";
import { Rectangle } from "./widget/rectangle";
import { Transformer } from "./widget/transformer";
const dom = document.getElementById("a")!;
const canvas = initCanvas(dom, 1000, 1000);

const rect1 = new Rectangle({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  style: { fillStyle: "blue", strokeStyle: "red" },
});

const rect2 = new Rectangle({
  x: 500,
  y: 400,
  width: 200,
  height: 200,
  style: { fillStyle: "blue", strokeStyle: "red" },
});

const rect3 = new Rectangle({
  x: 500,
  y: 400,
  width: 200,
  height: 200,
  style: { fillStyle: "blue", strokeStyle: "red" },
});

const rect = new Rectangle({
  x: 300,
  y: 400,
  width: 200,
  height: 200,
  // degree: 30,
  style: { fillStyle: "blue", strokeStyle: "red" },
});
console.log(rect);

canvas.place(rect);
// setTimeout(() => {
//   rect.update({ width: 240 });
//   console.log(rect);
// }, 2000);

// console.log(pointRotateTo({ x: 1, y: 0 }, { x: 0, y: 0 }, -90));
// console.log(fourFiveTo(-5.3));

// console.log(rect1.stringify());

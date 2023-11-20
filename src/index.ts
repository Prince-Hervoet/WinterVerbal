import { initCanvas } from "./core/initCanvas";
import { makeRoughCanvas } from "./thirdParty/roughCanvas";
import { calVectorDegree, fourFiveTo, rotatePoint } from "./util/math";
import { CanvasImg } from "./widget/canvasImg";
import { Rectangle } from "./widget/rectangle";
import { Transformer } from "./widget/transformer";
const dom = document.getElementById("a")!;
const testDom = document.getElementById("test")!;
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

// const rect = new Rectangle({
//   x: 300,
//   y: 400,
//   width: 200,
//   height: 200,
//   degree: 30,
//   style: { fillStyle: "blue", strokeStyle: "red" },
// });
// console.log(rect);

// canvas.place(rect);

const imgTest = new CanvasImg({
  x: 300,
  y: 300,
  width: 400,
  height: 400,
  src: "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF",
});

console.log(imgTest);
canvas.place(imgTest);

// console.log(pointRotateTo({ x: 1, y: 0 }, { x: 0, y: 0 }, -90));
// console.log(fourFiveTo(-5.3));

// console.log(rect1.stringify());

const rc = makeRoughCanvas(testDom as HTMLCanvasElement);
rc.line(80, 120, 300, 100, { bowing: 1, stroke: "green", strokeWidth: 4 }); // x1, y1, x2, y2

import { initCanvas } from "./core/initCanvas";
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

// for (let i = 0; i < 2; ++i) {
//   const rect = new Rectangle({
//     x: 300,
//     y: 400,
//     width: 200,
//     height: 200,
//     style: { fillStyle: "blue", strokeStyle: "red" },
//   });
//   console.log(rect);

//   canvas.place(rect);
// }

const imgTest = new CanvasImg({
  x: 300,
  y: 300,
  width: 400,
  height: 400,
  src: "https://t7.baidu.com/it/u=4198287529,2774471735&fm=193&f=GIF",
});

console.log(imgTest);
canvas.place(imgTest);

setTimeout(() => {
  imgTest.update({
    src: "https://t7.baidu.com/it/u=1956604245,3662848045&fm=193&f=GIF",
  });
}, 3000);

// console.log(rect1.stringify());

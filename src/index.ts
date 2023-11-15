import { initCanvas } from "./core/initCanvas";
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

console.log(rect1);

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

for (let i = 0; i < 20; ++i) {
  const rect = new Rectangle({
    x: 500,
    y: 400,
    width: 200,
    height: 200,
    style: { fillStyle: "blue", strokeStyle: "red" },
  });
  canvas.place(rect);
}

// console.log(rect1.stringify());

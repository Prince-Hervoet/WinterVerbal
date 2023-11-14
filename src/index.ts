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
  transformerStyle: { padding: 10 },
});

const tr = new Transformer({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  cornerWidth: 10,
  cornerHeight: 10,
});

canvas.place(rect1);

rect1.update({ x: 200, y: 200 });

console.log(rect1.stringify());

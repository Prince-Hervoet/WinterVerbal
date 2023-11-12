import { Verbal, makeVerbalCanvas } from "../src/core/verbal";
import { Rect } from "./../src/widget/rect";
import { Transformer } from "./../src/widget/transformer";

const tt = document.getElementById("a")!;
const canvas: Verbal = makeVerbalCanvas(tt as HTMLDivElement, 1000, 1000)!;
const wid1 = new Rect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  style: { strokeStyle: "blue" },
});

const wid2 = new Rect({
  x: 400,
  y: 100,
  width: 200,
  height: 200,
  style: { fillStyle: "green", strokeStyle: "red" },
});

const transformer = new Transformer({
  x: 400,
  y: 100,
  width: 200,
  height: 200,
  cornerWidth: 10,
  cornerHeight: 10,
  style: { strokeStyle: "red", fillStyle: "blue" },
});

canvas.place(wid1, transformer);

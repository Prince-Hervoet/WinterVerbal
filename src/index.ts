import { makeVerbalCanvas } from "./core/verbal";
import { Rect } from "./widget/rect";
import { Transformer } from "./widget/transformer";

const container = document.getElementById("a")!;
const canvas = makeVerbalCanvas(container, 1000, 1000)!;

const rect1 = new Rect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  style: { fillStyle: "blue" },
});

const rect2 = new Rect({
  x: 300,
  y: 100,
  width: 200,
  height: 200,
  style: { fillStyle: "red" },
});

const rect3 = new Rect({
  x: 300,
  y: 100,
  width: 200,
  height: 200,
  style: { strokeStyle: "black" },
});

canvas.place(rect1);

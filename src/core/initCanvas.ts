import { EventCenter } from "../event/eventCenter";
import { Verbal } from "./verbal";
import { VerbalCanvas } from "./verbalCanvas";

/**
 * 初始化画布，传入一个容器DOM，会自动生成两个canvas DOM，并返回一个可操作对象
 * @param container
 * @param width
 * @param height
 * @returns
 */
export function initCanvas(
  container: HTMLElement,
  width: number,
  height: number
) {
  const renderCanvasDom = document.createElement("canvas");
  const eventCanvasDom = document.createElement("canvas");
  container.setAttribute(
    "style",
    `position: relative; width: ${width}px; height: ${height}px;`
  );

  renderCanvasDom.setAttribute("width", width + "");
  renderCanvasDom.setAttribute("height", height + "");
  renderCanvasDom.setAttribute("style", "background-color: #ccc;");
  eventCanvasDom.setAttribute("width", width + "");
  eventCanvasDom.setAttribute("height", height + "");
  eventCanvasDom.setAttribute("style", `position: absolute; left: 0; top: 0;`);

  const renderCanvas = new VerbalCanvas(renderCanvasDom);
  const eventCanvas = new VerbalCanvas(eventCanvasDom);

  container.appendChild(renderCanvasDom);
  container.appendChild(eventCanvasDom);

  const eventCenter = new EventCenter(
    eventCanvasDom,
    renderCanvas,
    eventCanvas
  );
  return new Verbal(renderCanvas, eventCanvas, eventCenter);
}

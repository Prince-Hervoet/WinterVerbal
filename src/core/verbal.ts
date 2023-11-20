import { Transformer } from "../widget/transformer";
import { VerbalWidget } from "../widget/verbalWidget";
import { VerbalCanvas } from "./verbalCanvas";
import { EventCenter, StateEnum } from "./../event/eventCenter";

/**
 * 可操作类，其中包含各个画布的操作类
 */
export class Verbal {
  private renderCanvas: VerbalCanvas;
  private eventCanvas: VerbalCanvas;
  private eventCenter: EventCenter;
  private isPendingRender: boolean = false;

  constructor(
    renderCanvas: VerbalCanvas,
    eventCanvas: VerbalCanvas,
    eventCenter: EventCenter
  ) {
    this.renderCanvas = renderCanvas;
    this.eventCanvas = eventCanvas;
    this.eventCenter = eventCenter;
  }

  /**
   * 放置部件 -- 会自动加上更新监听函数
   * @param widgets
   */
  place(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      if (!widget) continue;
      widget.on("_update_watch", (event: any) => {
        if (this.isPendingRender) return;
        this.isPendingRender = true;
        requestAnimationFrame(() => {
          const target: VerbalWidget = event.target;
          if (this.renderCanvas.has(target)) this.renderCanvas.renderAll();
          if (this.eventCanvas.has(target)) this.eventCanvas.renderAll();
          this.isPendingRender = false;
        });
      });
    }
    this.renderCanvas.place(...widgets);
  }

  /**
   * 移除部件
   * @param widgets
   */
  remove(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      if (!widget) continue;
      widget.delete("_update_watch");
      this.eventCanvas.remove(widget);
      this.renderCanvas.remove(widget);
    }
  }

  /**
   * 将画布转成自由绘画模式
   * @param style
   */
  freeDraw(style: any) {
    this.eventCenter.setState(StateEnum.FREEDRAW);
    this.eventCenter.setFreeDrawStyle(style);
  }
}

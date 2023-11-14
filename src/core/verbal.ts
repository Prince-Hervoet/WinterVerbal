import { Transformer } from "../widget/transformer";
import { VerbalWidget } from "../widget/verbalWidget";
import { VerbalCanvas } from "./verbalCanvas";
import { EventCenter } from "./../event/eventCenter";

export class Verbal {
  private renderCanvas: VerbalCanvas;
  private eventCanvas: VerbalCanvas;
  private eventCenter: EventCenter;

  constructor(
    renderCanvas: VerbalCanvas,
    eventCanvas: VerbalCanvas,
    eventCenter: EventCenter
  ) {
    this.renderCanvas = renderCanvas;
    this.eventCanvas = eventCanvas;
    this.eventCenter = eventCenter;
  }

  place(...widgets: VerbalWidget[]) {
    for (const widget of widgets) {
      if (!widget.getTransformer())
        widget.set("transformer", new Transformer({}));
      widget.on("_update_watch", (event: any) => {
        const target: VerbalWidget = event.target;
        if (this.renderCanvas.has(target)) this.renderCanvas.renderAll();
        if (this.eventCanvas.has(target)) this.eventCanvas.renderAll();
      });
    }
    this.renderCanvas.place(...widgets);
  }
}

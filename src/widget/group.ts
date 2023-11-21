import { VerbalWidget } from "./verbalWidget";

export class Group extends VerbalWidget {
  shapeName: string = "group";

  members: VerbalWidget[] = [];

  offsets: any = [];

  constructor(props: any) {
    super(props);
    this.members = props.members ?? [];
    this.initOffsets();
  }

  private initOffsets() {
    for (const member of this.members) {
      const pos = member.getBoundingBoxPosition();
      this.offsets.push({ x: pos.x - this.x, y: pos.y - this.y });
    }
  }

  protected _updateAfter(props: any): void {
    this.members.forEach((member: VerbalWidget, index: number) => {
      member.set("x", this.x + this.offsets[index].x);
      member.set("y", this.y + this.offsets[index].y);
    });
    this.members[0].update({});
  }

  protected _updatePathPoints() {
    this.pathPoints = [];
    this.pathPoints.push({ x: this.x, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y });
    this.pathPoints.push({ x: this.x + this.width, y: this.y + this.height });
    this.pathPoints.push({ x: this.x, y: this.y + this.height });
  }
}

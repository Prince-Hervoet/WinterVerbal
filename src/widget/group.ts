import { VerbalWidget } from "./verbalWidget";

class Group extends VerbalWidget {
  shapeName: string = "group";

  members: VerbalWidget[] = [];

  protected _update(props: any) {
    this.members.forEach((member: VerbalWidget) => {
      member.update(props);
    });
  }
}

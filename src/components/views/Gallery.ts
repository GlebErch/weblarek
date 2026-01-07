import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  protected catalogList: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.catalogList = ensureElement<HTMLElement>(".gallery");
  }
  set catalog(items: HTMLElement[]) {
    this.catalogList.replaceChildren(...items);
  }
}

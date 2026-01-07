import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected headerButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );
    this.headerButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );

    this.headerButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}

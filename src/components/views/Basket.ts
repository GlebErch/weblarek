// import { IProduct, IActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface IBasket {
  total: number;
}

export class Basket extends Component<IBasket> {
  protected basketItems: HTMLElement;
  protected totalPrice: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.basketItems = ensureElement<HTMLElement>(".basket__list", container);
    this.totalPrice = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(".button", container);

    if (this.orderButton) {
      this.orderButton.addEventListener("click", () => {
        events.emit("order:open");
      });
    }
  }

  set items(items: HTMLElement[]) {
    this.basketItems.replaceChildren(...items);
    this.orderButton.disabled = false;
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }
}

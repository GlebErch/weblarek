import { IProduct, IActions } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export interface IBasket {
  total: number;
}

export interface IBasketItem extends Pick<IProduct, "title" | "price"> {
  index: number;
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

  set emptyBasket(state: boolean) {
    this.basketItems.replaceChildren(
      createElement("p", { textContent: "Корзина пуста" })
    );
    this.orderButton.disabled = state;
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }
}

export class BasketItem extends Component<IBasketItem> {
  protected itemIndex: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IActions) {
    super(container);

    this.itemIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      container
    );
    this.cardTitle = ensureElement<HTMLElement>(".card__title", container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", container);
    this.buttonDelete = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    if (this.buttonDelete) {
      this.buttonDelete.addEventListener("click", (event: MouseEvent) => {
        actions?.onClick?.(event);
      });
    }
  }

  set index(value: number) {
    this.itemIndex.textContent = String(value + 1);
  }

  set title(title: string) {
    this.cardTitle.textContent = title;
  }

  set price(price: number) {
    this.cardPrice.textContent = `${price} синапсов`;
  }
}

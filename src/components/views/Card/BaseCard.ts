import { IActions, IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard extends Pick<IProduct, "title" | "price"> {
  index: number;
}

export class BaseCard extends Component<ICard> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected currentPrice: string | null = "";

  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);

    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }

  set title(title: string) {
    if (this.cardTitle) {
      this.cardTitle.textContent = title;
    }
  }

  set price(price: string | null) {
    if (price) {
      if (this.cardPrice) {
        this.cardPrice.textContent = `${price} синапсов`;
      }
      this.currentPrice = price;
    } else {
      if (this.cardPrice) {
        this.cardPrice.textContent = "Бесценно";
      }
      this.currentPrice = null;
    }
  }
}

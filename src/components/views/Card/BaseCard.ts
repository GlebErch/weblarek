import { IProduct} from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";


export interface ICard extends Pick<IProduct, "title" | "price"> {
  index: number;
}

export class BaseCard extends Component<ICard> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);

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
    } else {
      if (this.cardPrice) {
        this.cardPrice.textContent = "Бесценно";
      }
    }
  }

}
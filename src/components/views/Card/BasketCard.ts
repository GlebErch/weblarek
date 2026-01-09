import { IActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class BasketCard extends BaseCard {
  protected itemIndex: HTMLElement;
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

}

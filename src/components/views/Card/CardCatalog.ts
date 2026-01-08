import { IActions } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class CardCatalog extends BaseCard {
  protected cardImage: HTMLImageElement;
  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }
    set image(image: string) {
    this.cardImage.src = image;
  }
}

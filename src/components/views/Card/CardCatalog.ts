import { IActions } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends BaseCard {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;
  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }
  set image(image: string) {
    this.cardImage.src = image;
  }

  set category(category: string) {
    this.cardCategory.textContent = category;

    for (const key in categoryMap) {
      this.cardCategory?.classList.toggle(
        categoryMap[key as CategoryKey],
        key === category
      );
    }
  }
}

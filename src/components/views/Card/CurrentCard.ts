import { CategoryKey, IActions } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { BaseCard } from "./BaseCard";

export class CurrentCard extends BaseCard {
  protected cardButton: HTMLButtonElement;
  protected cardDescription: HTMLElement;
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement, events?: IActions) {
    super(container);

    this.cardDescription = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".button",
      this.container
    );
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }

  set buttonState(state: boolean) {
    this.cardButton.disabled = !state;
  }

  set description(description: string | null) {
    if (description) {
      this.cardDescription.textContent = description;
    }
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

  set image(image: string) {
    this.cardImage.src = image;
  }

  set button(value: string) {
    this.cardButton.textContent = value;
  }
}

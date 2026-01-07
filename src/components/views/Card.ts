import { IActions, IProduct } from "../../types";
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

type CategoryKey = keyof typeof categoryMap;

export class BaseCard extends Component<IProduct> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected currentPrice: string | null = "";
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
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
}

export class CardCatalog extends BaseCard {
  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);

    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }
}

export class CurrentCard extends BaseCard {
  protected cardButton: HTMLButtonElement;
  protected cardDescription: HTMLElement;

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
    if (this.cardButton && events?.onClick) {
      this.cardButton.addEventListener("click", (event) => {
        event.stopPropagation();
        events.onClick(event);
      });
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

  set button(value: string) {
    this.cardButton.textContent = value;
  }
}

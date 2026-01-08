import { IActions } from "../../../types";
import { BaseCard } from "./BaseCard";

export class CardCatalog extends BaseCard {
  constructor(protected container: HTMLElement, events?: IActions) {
    super(container);

    if (events?.onClick) {
      container.addEventListener("click", events.onClick);
    }
  }
}

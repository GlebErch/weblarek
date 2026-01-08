import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class SuccessWindow extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this._total = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    if (actions?.onClick) {
      this._close.addEventListener("click", actions.onClick);
    }
  }

  set total(value: number | { total: number }) {
    const amount = typeof value === "object" ? value.total : value;
    this._total.textContent = (this._total, `Списано ${amount} синапсов`);
  }
}

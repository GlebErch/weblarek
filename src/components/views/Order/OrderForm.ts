import { TPayment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./BaseForm";

export class OrderForm extends Form {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>(
      ".form__input[name=address]",
      this.container
    );

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      "button[name]",
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        this.events.emit("order.payment:change", { value: button.name });
      });
    });

  }

  set payment(value: TPayment) {
    this.paymentButtons.forEach((button) => {
      if (button.name == value) {
        button.classList.add("button_alt-active");
      } else {
        button.classList.remove("button_alt-active");
      }
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}

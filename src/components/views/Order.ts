import { TPayment, TContactFormInfo, TOrderFormInfo } from "../../types";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "../extend/BaseForm";

export class OrderForm extends Form<TOrderFormInfo> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  protected selectedPayment: TPayment = "";

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
        const payType = button.getAttribute("name") as TPayment;
        this.paymentButtons.forEach((btn) => {
          btn.classList.remove("button_alt-active");
        });
        button.classList.add("button_alt-active");
        this.events.emit("order.payment:change", { value: payType });
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order.address:change", {
        value: this.addressInput.value,
      });
    });
  }
}

export class ContactsForm extends Form<TContactFormInfo> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>(
      ".form__input[name=email]",
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      ".form__input[name=phone]",
      this.container
    );
    this.emailInput.addEventListener("input", () => {
      this.events.emit("contact.email:change", {
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contact.phone:change", {
        value: this.phoneInput.value,
      });
    });
  }
}

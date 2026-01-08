import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./BaseForm";

export class ContactsForm extends Form {
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

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
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
  set phone(value: string) {
    this.phoneInput.value = value;
  }
}

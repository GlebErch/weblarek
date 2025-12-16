import { IBuyer, TPayment, TValidationErrors } from "../../types/index";


export class ModelBuyer {
  protected _buyer: IBuyer;

  constructor() {
    this._buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
  }

  setPayment(payment: TPayment): void {
    this._buyer.payment = payment;
  }

  setEmail(email: string): void {
    this._buyer.email = email;
  }

  setPhone(phone: string): void {
    this._buyer.phone = phone;
  }

  setAddress(address: string): void {
    this._buyer.address = address;
  }

  getBuyer(): IBuyer {
    return this._buyer;
  }

  clearBuyer(): void {
    this._buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
  }

  validateBuyer(): TValidationErrors {
    const errors: TValidationErrors = {};
    if (!this._buyer.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this._buyer.address) {
      errors.address = "Не указан адрес доставки";
    }
    if (!this._buyer.email) {
      errors.email = "Не указан email";
    }
    if (!this._buyer.phone) {
      errors.phone = "Не указан телефон";
    }
    return errors;
  }
}

import { IBuyer, TPayment, TValidationErrors } from "../../types/index";


export class ModelBuyer {
  protected buyer: IBuyer;

  constructor() {
    this.buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
  }

  setPayment(payment: TPayment): void {
    this.buyer.payment = payment;
  }

  setEmail(email: string): void {
    this.buyer.email = email;
  }

  setPhone(phone: string): void {
    this.buyer.phone = phone;
  }

  setAddress(address: string): void {
    this.buyer.address = address;
  }

  getBuyer(): IBuyer {
    return this.buyer;
  }

  clearBuyer(): void {
    this.buyer = {
      address: "",
      email: "",
      payment: "",
      phone: "",
    };
  }

  validateBuyer(): TValidationErrors {
    const errors: TValidationErrors = {};
    if (!this.buyer.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.buyer.address) {
      errors.address = "Не указан адрес доставки";
    }
    if (!this.buyer.email) {
      errors.email = "Не указан email";
    }
    if (!this.buyer.phone) {
      errors.phone = "Не указан телефон";
    }
    return errors;
  }
}

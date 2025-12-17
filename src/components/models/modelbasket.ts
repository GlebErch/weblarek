import { IProduct } from "../../types/index";

export class ModelBasket {
  protected basket: IProduct[];

  constructor() {
    this.basket = [];
  }

  getBasket(): IProduct[] {
    return this.basket;
  }

  addToBasket(item: IProduct): void {
    if (item) {
      this.basket.push(item);
    }
  }

  removeFromBasket(item: IProduct): void {
    if (item) {
      this.basket = this.basket.filter((basket) => basket.id !== item.id);
    }
  }

  clearBasket(): void {
    this.basket = [];
  }

  priceBasket(): number {
    return this.basket.reduce((sum, basket) => sum + (basket.price ?? 0), 0);
  }

  countBasket(): number {
    return this.basket.length;
  }

  isInBasket(item: IProduct): boolean {
    return item ? this.basket.includes(item) : false;
  }
}

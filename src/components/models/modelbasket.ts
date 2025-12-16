import { IProduct } from "../../types/index";

export class ModelBasket {
  protected _basket: IProduct[];

  constructor() {
    this._basket = [];
  }
  
  getBasket(): IProduct[] {
    return this._basket;
  }

  addToBasket(item: IProduct | undefined): void {
    if (item) {
      this._basket.push(item);
    }
  }

  removeFromBasket(item: IProduct | undefined): void {
    if (item) {
      this._basket = this._basket.filter((basket) => basket.id !== item.id);
    }
  }

  clearBasket(): void {
    this._basket = [];
  }

  priceBasket(): number {
    return this._basket.reduce((sum, basket) => sum + (basket.price ?? 0), 0);
  }

  countBasket(): number {
    return this._basket.length;
  }

  isInBasket(item: IProduct | undefined): boolean {
    return item ? this._basket.includes(item) : false;
  }
}

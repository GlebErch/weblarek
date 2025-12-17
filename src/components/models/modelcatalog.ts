import { IProduct } from "../../types/index";

export class ModelCatalog {
  protected items: IProduct[];
  protected current: string | null;

  constructor() {
    this.items = [];
    this.current = null;
  }

  loadItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProduct(cardId: string): IProduct {
    const item = this.items.find((item) => item.id === cardId);
    if (!item) {
      throw new Error(`Товар с ID ${cardId} не найден`);
    }
    return item;
  }
  setCurrent(item: IProduct): void {
    if (item) {
      this.current = item.id;
    }
  }

  getCurrent(): IProduct {
    const item = this.current;
    if (!item) {
      throw new Error(`Карточка не выбрана`);
    }
    return this.getProduct(item);
  }
}

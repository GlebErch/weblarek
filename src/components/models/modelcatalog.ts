import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ModelCatalog {
  protected items: IProduct[];
  protected current: string | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.current = null;
    this.events = events;
  }

  loadItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("initialData:loaded", { items: this.items });
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
      this.events.emit("current:changed", item);
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

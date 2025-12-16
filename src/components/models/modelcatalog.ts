import { IProduct } from "../../types/index";

export class ModelCatalog {
  protected _items: IProduct[];
  protected _current: string | null;

  constructor() {
    this._items = [];
    this._current = null;
  }

  loadItems(items: IProduct[]): void {
    this._items=[];
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getProduct(cardId: string): IProduct | undefined {
    return this._items.find((item) => item.id === cardId);
  }

  setCurrent(item: IProduct | undefined): void {
    if (item) {
      this._current = item.id;
    }
  }

  getCurrent(): IProduct | undefined {
    return this._current ? this.getProduct(this._current) : undefined;
  }
}

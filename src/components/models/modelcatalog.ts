import { IProduct } from "../../types/index";

export class ModelCatalog {
  protected items: IProduct[];
  protected current: string | null;

  constructor() {
    this.items = [];
    this.current = null;
  }

  loadItems(items: IProduct[]): void {
    this.items=[];
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProduct(cardId: string): IProduct | undefined {
    return this.items.find((item) => item.id === cardId);
  }

  setCurrent(item: IProduct | undefined): void {
    if (item) {
      this.current = item.id;
    }
  }

  getCurrent(): IProduct | undefined {
    return this.current ? this.getProduct(this.current) : undefined;
  }
}

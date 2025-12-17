import { ApiResponse, IProduct, IApi, IOrderResult, IOrder } from "../../types";
//import { Api } from "../base/Api";

export class ShopAPI {
  private cdn: string;
  private api: IApi;

  constructor(api: IApi, cdn: string) {
    this.api = api;
    this.cdn = cdn;
  }

  getCatalog(): Promise<IProduct[]> {
    return this.api.get<ApiResponse>("/product").then((response) => {
      return response.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }));
    });
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post("/order", order);
  }
}

import { ApiResponse, IProduct, IApi } from "../../types";
import { Api } from "../base/Api";

export class ShopAPI extends Api implements IApi {
  private cdn: string;
  constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getCatalog(): Promise<IProduct[]> {
    return this.get<ApiResponse<IProduct>>("/product").then((data) => {
      return data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image, // ← ВЕРНИ ЭТО!
      }));
    });
  }
  /*
postOrder(): Promise<IOrder> {
    
}*/
}

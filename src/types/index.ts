
export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

/*Интерфейс товара*/
export interface IProduct {
  id: string; // Идентификатор товара
  description: string; // Описание товара
  image: string; // Ссылка на изображение товара
  title: string; // Название товара
  category: string; // Категория
  price: number | null; // Цена
}

/*Интерфейс покупателя*/
export interface IBuyer {
  payment: TPayment; // Способ оплаты
  email: string; // email покупателя
  phone: string; // Телефон покупателя
  address: string; // Адрес доставки
}

/*Вид платежа*/
export type TPayment = "card" | "cash" | "";

/*Тип для валидации данных покупателя*/
export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;


export interface IActions {
  onClick: (event: MouseEvent) => void;
}



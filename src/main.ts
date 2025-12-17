import "./scss/styles.scss";
import { ModelCatalog } from "./components/models/modelcatalog.ts";
import { ModelBasket } from "./components/models/modelbasket.ts";
import { ModelBuyer } from "./components/models/modelbuyer.ts";
import { apiProducts } from "./utils/data";
import { IProduct } from "./types";
import { ShopAPI } from "./components/extend/ShopAPIi.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { Api } from "./components/base/Api.ts";

const сatalogModel = new ModelCatalog();
const basketModel = new ModelBasket();
const buyerModel = new ModelBuyer();
const baseApi = new Api(API_URL);
const api = new ShopAPI(baseApi, CDN_URL);
let item: IProduct | undefined;

/*Проверка модуля каталога*/
console.log("----------------Проверяем работу модуля каталога----------------");
сatalogModel.loadItems(apiProducts.items);
console.log("Массив товаров из каталога: ", сatalogModel.getItems());
item = сatalogModel.getProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(
  "Получаем товар из каталога по id=854cef69-976d-4c2a-a18c-2aa45046c390",
  item
);
console.log("Учитываем полученный товар текущим/просматриваемым");
сatalogModel.setCurrent(item);

console.log("Получаем выбранный товар из каталога", сatalogModel.getCurrent());

/*Проверка модуля корзины*/
console.log("----------------Проверяем работу модуля корзины----------------");
console.log(
  "Добавляем в корзину товары с id 854cef69-976d-4c2a-a18c-2aa45046c390, c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
basketModel.addToBasket(item);

item = сatalogModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
basketModel.addToBasket(item);

console.log("В корзине следующие товары: ", basketModel.getBasket());
console.log(
  "Получаем стоимость товаров в корзине: ",
  basketModel.priceBasket()
);
console.log(
  "Получаем количество товаров в корзине: ",
  basketModel.countBasket()
);
item = сatalogModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log(
  "Проверяем наличие товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ",
  basketModel.isInBasket(item)
);

console.log(
  "Удаляем из корзины товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
basketModel.removeFromBasket(item);

console.log(
  "Проверяем наличие товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ",
  basketModel.isInBasket(item)
);

console.log("В корзине следующие товары: ", basketModel.getBasket());
console.log("Очищаем корзину ");
basketModel.clearBasket();
console.log("В корзине следующие товары: ", basketModel.getBasket());

/*Проверка модуля пользователя*/

console.log(
  "----------------Проверяем работу модуля покупателя----------------"
);
console.log("Добавляем тип оплаты покупателя - card");
buyerModel.setPayment("card");
console.log("Добавляем адрес покупателя г. Урюпинск, ул. Ленина, д.1");
buyerModel.setAddress("г. Урюпинск, ул. Ленина, д.1");
console.log("Проверяем пользователя", buyerModel.validateBuyer());
console.log("Добавляем телефон покупателя +79000888555");
buyerModel.setPhone("+79000888555");
console.log("Добавляем email покупателя");
buyerModel.setEmail("Vanya@mail.ru");
console.log("Проверяем данные пользователя", buyerModel.validateBuyer());
console.log("Получаем данные пользователя", buyerModel.getBuyer());
console.log("Удаляем данные пользователя");
buyerModel.clearBuyer();
console.log("Получаем данные пользователя", buyerModel.getBuyer());

/*Проверка получения с сервера*/
console.log(
  "----------------Проверяем работу модуля коммуникации----------------"
);
console.log("Получаем каталог с сервера");
api
  .getCatalog()
  .then((items) => {
    сatalogModel.loadItems(items);
    console.log("Новый каталог", сatalogModel.getItems());
  })
  .catch((err) => console.error(err));

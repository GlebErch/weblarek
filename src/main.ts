import "./scss/styles.scss";
import { ModelCatalog } from "./components/models/modelcatalog.ts";
import { ModelBasket } from "./components/models/modelbasket.ts";
import { ModelBuyer } from "./components/models/modelbuyer.ts";
import { apiProducts } from "./utils/data";
import { IProduct } from "./types";
import { ShopAPI } from "./components/extend/ShopAPIi.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";

const CatalogModel = new ModelCatalog();
const BasketModel = new ModelBasket();
const BuyerModel = new ModelBuyer();
const api = new ShopAPI(API_URL, CDN_URL);
let item: IProduct | undefined;

/*Проверка модуля каталога*/
CatalogModel.loadItems(apiProducts.items);
console.log("Массив товаров из каталога: ", CatalogModel.getItems());
item = CatalogModel.getProduct("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(
  "Получаем товар из каталога по id=854cef69-976d-4c2a-a18c-2aa45046c390",
  item
);
console.log("Учитываем полученный товар текущим/просматриваемым");
CatalogModel.setCurrent(item);

console.log("Получаем выбранный товар из каталога");
CatalogModel.getCurrent();
/*Проверка модуля корзины*/

console.log(
  "Добавляем в корзину товары с id 854cef69-976d-4c2a-a18c-2aa45046c390, c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
BasketModel.addToBasket(item);

item = CatalogModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
BasketModel.addToBasket(item);

console.log("В корзине следующие товары: ", BasketModel.getBasket());
console.log(
  "Получаем стоимость товаров в корзине: ",
  BasketModel.priceBasket()
);
console.log(
  "Получаем количество товаров в корзине: ",
  BasketModel.countBasket()
);
item = CatalogModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log(
  "Проверяем наличие товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ",
  BasketModel.isInBasket(item)
);

console.log(
  "Удаляем из корзины товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9"
);
BasketModel.removeFromBasket(item);

console.log(
  "Проверяем наличие товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ",
  BasketModel.isInBasket(item)
);

console.log("В корзине следующие товары: ", BasketModel.getBasket());
console.log("Очищаем корзину ");
BasketModel.clearBasket();
console.log("В корзине следующие товары: ", BasketModel.getBasket());

/*Проверка модуля пользователя*/

console.log("Добавляем тип оплаты покупателя - card");
BuyerModel.setPayment("card");
console.log("Добавляем адрес покупателя г. Урюпинск, ул. Ленина, д.1");
BuyerModel.setAddress("г. Урюпинск, ул. Ленина, д.1");
console.log("Проверяем пользователя", BuyerModel.validateBuyer());
console.log("Добавляем телефон покупателя +79000888555");
BuyerModel.setPhone("+79000888555");
console.log("Добавляем email покупателя");
BuyerModel.setEmail("Vanya@mail.ru");
console.log("Проверяем данные пользователя", BuyerModel.validateBuyer());
console.log("Получаем данные пользователя", BuyerModel.getBuyer());
console.log("Удаляем данные пользователя");
BuyerModel.clearBuyer();
console.log("Получаем данные пользователя", BuyerModel.getBuyer());

console.log("Получаем каталог с сервера");
api
  .getCatalog()
  .then((items) => {
    CatalogModel.loadItems(items);
    console.log("Новый каталог", CatalogModel.getItems());
  })
  .catch((err) => console.error(err));

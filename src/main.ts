import "./scss/styles.scss";
import { Api } from "./components/base/Api.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { IOrder, ShopAPI } from "./components/extend/ShopAPI.ts";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, TPayment } from "./types";
import { ModelCatalog } from "./components/models/modelcatalog.ts";
import { ModelBasket } from "./components/models/modelbasket.ts";
import { ModelBuyer } from "./components/models/modelbuyer.ts";
import { Header } from "./components/views/Header.ts";
import { Gallery } from "./components/views/Gallery";
import { Basket } from "./components/views/Basket";
import { SuccessWindow } from "./components/extend/SuccessWindow";
import { Modal } from "./components/views/BaseModal.ts";
import { CurrentCard } from "./components/views/Card/CurrentCard.ts";
import { CardCatalog } from "./components/views/Card/CardCatalog.ts";
import { BasketCard } from "./components/views/Card/BasketCard.ts";
import { OrderForm } from "./components/views/Order/OrderForm.ts";
import { ContactsForm } from "./components/views/Order/ContactsForm.ts";

// Общие модули
const baseApi = new Api(API_URL);
const api = new ShopAPI(baseApi, CDN_URL);
const events = new EventEmitter();

// Модели данных
const catalogModel = new ModelCatalog(events);
const basketModel = new ModelBasket(events);
const buyerModel = new ModelBuyer(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

//Представления
const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(cloneTemplate(cardCatalogTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const success = new SuccessWindow(cloneTemplate(successTemplate), {
  onClick: () => {
    modal.close();
  },
});

// Создание карточек каталога:
events.on("initialData:loaded", () => {
  const cardsArray = catalogModel.getItems().map((item) => {
    const cardInstant = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return cardInstant.render(item);
  });
  console.log(cardsArray);
  gallery.render({ catalog: cardsArray });
});

// Выбираем карточку
events.on("card:select", (item: IProduct) => {
  catalogModel.setCurrent(item);
});

// Создание превью текущей карточки:
const card = new CurrentCard(cloneTemplate(cardPreviewTemplate), {
  onClick: () => {
    events.emit("current.button:click", card);
  },
});

events.on("current:changed", () => {
  const item = catalogModel.getCurrent();

  if (item.price === null || item.price === undefined) {
    card.buttonState = false;
    card.button = "Недоступно";
  } else {
    if (basketModel.isInBasket(item)) {
      card.button = "Удалить из корзины";
    } else {
      card.button = "В корзину";
    }
  }
  const renderedCard = card.render(item);
  modal.render({
    content: renderedCard,
  });
});

events.on("current.button:click", (card: CurrentCard) => {
  const item = catalogModel.getCurrent();
  if (!basketModel.isInBasket(item)) {
    basketModel.addToBasket(item);
    card.button = "Удалить из корзины";
  } else {
    basketModel.removeFromBasket(item);
    card.button = "В корзину";
  }
  const renderedCard = card.render(item);
  console.log(item);
  console.log(renderedCard);
  modal.render({
    content: renderedCard,
  });
  // cardButtonState(item, card);
});

//Изменение корзины
events.on("basket:change", () => {
  const basketData = basketModel.getBasket();

  const basketItems = basketData.map((items, index) => {
    const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit("basket:remove", items);
      },
    });
    return card.render({
      index: index,
      title: items.title,
      price: items.price,
    });
  });

  basket.items = basketItems;
  basket.total = basketData.reduce((sum, product) => sum + product.price!, 0);
  header.counter = basketModel.countBasket();
});

events.on("basket:open", () => {
  modal.render({
    content: basket.render(),
  });
});

events.on("basket:remove", (item: IProduct) => {
  basketModel.removeFromBasket(item);
});

//Проверка данных покупателя
function validateForm(): void {
  const error = buyerModel.validateBuyer();
  const { payment, address, email, phone } = error;
  const orderFormIsValid = !payment && !address;
  order.valid = orderFormIsValid;
  if (!orderFormIsValid) {
    order.errors = [address, payment].filter(Boolean).join(" ; ");
  } else {
    order.errors = "";
  }
  const contactsFormIsValid = !email && !phone;
  contacts.valid = contactsFormIsValid;
  if (!contactsFormIsValid) {
    contacts.errors = [email, phone].filter(Boolean).join(" ; ");
  } else {
    contacts.errors = "";
  }
}

//Работа с формами
events.on("order:open", () => {
  modal.render({
    content: order.render({
      valid: false,
      errors: [],
    }),
  });
  validateForm();
});

events.on("order.payment:change", (data: { value: TPayment }) => {
  buyerModel.setPayment(data.value);
  validateForm();
  order.payment = data.value;
});

events.on("order.address:change", (data: { value: string }) => {
  buyerModel.setAddress(data.value);
  validateForm();
});

events.on("order:submit", () => {
  modal.render({
    content: contacts.render({
      valid: false,
      errors: [],
    }),
  });
  validateForm();
});

events.on("contact.email:change", (data: { value: string }) => {
  buyerModel.setEmail(data.value);
  validateForm();
});

events.on("contact.phone:change", (data: { value: string }) => {
  buyerModel.setPhone(data.value);
  validateForm();
});

// Отправление формы заказа
events.on("contacts:submit", () => {
  const postData: IOrder = Object.assign(buyerModel.getBuyer(), {
    total: basketModel.priceBasket(),
    items: basketModel.getBasket().map((item) => item.id),
  });

  api
    .postOrder(postData)
    .then((response) => {
      const totalAmount = response.total;
      basketModel.clearBasket();
      modal.render({
        content: success.render({
          total: totalAmount,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

// Получение товаров с сервера
api
  .getCatalog()
  .then((items) => {
    catalogModel.loadItems(items);
  })
  .catch((err) => console.error(err));

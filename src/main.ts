import "./scss/styles.scss";
import { Api } from "./components/base/Api.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { ShopAPI } from "./components/extend/ShopAPI.ts";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IOrder, IProduct, TPayment, TValidationErrors } from "./types";
import { ModelCatalog } from "./components/models/modelcatalog.ts";
import { ModelBasket } from "./components/models/modelbasket.ts";
import { ModelBuyer } from "./components/models/modelbuyer.ts";
import { Header } from "./components/views/Header.ts";
import { Gallery } from "./components/views/Gallery";
import { CurrentCard, CardCatalog } from "./components/views/Card.ts";
import { Basket, BasketItem } from "./components/views/Basket";
import { ContactsForm, OrderForm } from "./components/views/Order";
import { SuccessWindow } from "./components/extend/SuccessWindow";
import { Modal } from "./components/extend/BaseModal";

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

//Изменение состояния кнопки добавления в корзину, в зависимости от того есть ли уже в корзине тот же товар
function cardButtonState(item: IProduct, card: CurrentCard) {
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
}

// Создание карточек каталога:
events.on("initialData:loaded", () => {
  header.counter = basketModel.countBasket();
  const cardsArray = catalogModel.getItems().map((item) => {
    const cardInstant = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return cardInstant.render(item);
  });
  gallery.render({ catalog: cardsArray });
});

// Выбираем карточку
events.on("card:select", (item: IProduct) => {
  catalogModel.setCurrent(item);
});

// Создание превью текущей карточки:
events.on("current:changed", (item: IProduct) => {
  const card = new CurrentCard(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (!basketModel.isInBasket(item)) {
        basketModel.addToBasket(item);
      } else {
        basketModel.removeFromBasket(item);
      }
      cardButtonState(item, card);
    },
  });
  const renderedCard = card.render(item);
  modal.render({
    content: renderedCard,
  });
  cardButtonState(item, card);
});

//Изменение корзины
events.on("basket:change", () => {
  const basketData = basketModel.getBasket();

  const basketItems = basketData.map((items, index) => {
    const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
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

  if (basketItems.length) {
    basket.items = basketItems;
  } else {
    basket.emptyBasket = true;
  }
  basket.total = basketData.reduce((sum, product) => sum + product.price!, 0);
  header.counter = basketModel.countBasket();
});

events.on("basket:open", () => {
  if (basketModel.countBasket() === 0) {
    basket.emptyBasket = true;
  }
  modal.render({
    content: basket.render(),
  });
});

events.on("basket:remove", (item: IProduct) => {
  basketModel.removeFromBasket(item);
});

//Проверка данных покупателя
events.on("FormErrors:validate", (error: Partial<TValidationErrors>) => {
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
});

//Работа с формами
events.on("order:open", () => {
  modal.render({
    content: order.render({
      valid: false,
      errors: [],
    }),
  });
  buyerModel.validateBuyer();
});

events.on("order.payment:change", (data: { value: TPayment }) => {
  buyerModel.setPayment(data.value);
  buyerModel.validateBuyer();
});

events.on("order.address:change", (data: { value: string }) => {
  buyerModel.setAddress(data.value);
  buyerModel.validateBuyer();
});

events.on("order:submit", () => {
  modal.render({
    content: contacts.render({
      valid: false,
      errors: [],
    }),
  });
  buyerModel.validateBuyer();
});

events.on("contact.email:change", (data: { value: string }) => {
  buyerModel.setEmail(data.value);
  buyerModel.validateBuyer();
});

events.on("contact.phone:change", (data: { value: string }) => {
  buyerModel.setPhone(data.value);
  buyerModel.validateBuyer();
});

// Отправление формы заказа
events.on("contacts:submit", () => {
  const postData: IOrder = Object.assign({}, buyerModel.getBuyer(), {
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

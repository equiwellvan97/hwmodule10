const form = document.querySelector("#form_add");
const inputName = document.querySelector("#text_name");
const inputPrice = document.querySelector("#price");
const inputDesc = document.querySelector("#description");
const inputCategory = document.querySelector("#newCategory");
const buttonAdd = document.querySelector(".button_add");
const newList = document.querySelector(".newList");
const loadMore = document.querySelector(".load_more");

let list = [];

// Получаем данные с API
async function getProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Ошибка в получении данных");
    }
    const data = await response.json();
    list = data.slice(0, 6); // добавили результат запроса в переменную с пустым массивом
    showProducts(list);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

getProducts();

// Отображаем получаемые данные на странице
function showProducts(data) {
  data.forEach((product) => {
    const showCard = document.createElement("div");
    showCard.className = "showList";
    showCard.innerHTML = `
    <br>
  <h3>${product.title}</h3>
  <br>
  <p>Price: ${product.price}$</p>
  <br>
  <p>${product.description}</p>
  <br>
  <p>Category: ${product.category}</p>
  <button class="delete_btn">Удалить товар</button>
  `;

    showCard.querySelector(".delete_btn").addEventListener("click", () => {
      deleteProduct(product.id);
      showCard.remove();
    });

    newList.appendChild(showCard);
  });
}

// Реализуем способ добавлять свои задачи на сайт
form.addEventListener("submit", (event) => {
  event.preventDefault();

  async function addProduct() {
    const newProducts = {
      title: inputName.value,
      price: inputPrice.value,
      description: inputDesc.value,
      category: inputCategory.value,
    };

    if (
      inputName.value === "" ||
      inputPrice.value === "" ||
      inputDesc.value === "" ||
      inputCategory.value === ""
    ) {
      alert("Вы оставили поля пустыми!");
    } else {
      try {
        const response = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProducts),
        });
        if (!response.ok) {
          throw new Error("Ошибка получения данных");
        }
        const data = await response.json();
        list = [];
        list.push(data);
        showProducts(list);
        alert("Вы успешно добавили товар!");
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при добавлении товара, повторите попытку позже!");
      }
    }
  }

  addProduct();

  inputName.value = "";
  inputPrice.value = "";
  inputDesc.value = "";
  inputCategory.value = "";
});

async function deleteProduct(productId) {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Ошибка в получении данных");
    }
    list = list.filter((product) => product.id !== productId);
    // showProducts(list);
    alert("Товар успешно удален!");
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось удалить товар, попробуйте повторить попытку позже!");
  }
}

let currentIndex = 6;
let itemPerPage = 6;

async function loadMoreFunc() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Ошибка в получении данных");
    }
    list = await response.json();
    const nextProducts = list.slice(currentIndex, currentIndex + itemPerPage);
    if (nextProducts.length === 0) {
      alert("Все товары загружены!");
    }
    showProducts(nextProducts);
    currentIndex += itemPerPage;
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

loadMore.addEventListener("click", loadMoreFunc);

async function filterProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Ошибка в получении данных");
    }
    const data = await response.json();
    const filter = document.querySelector("#filter_products").value;
    list = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].category == filter) {
        const removeProducts = document.querySelector(".newList");
        removeProducts.innerHTML = "";
        list.push(data[i]);
        loadMore.remove();
        const all_prod = document.createElement("button");
        all_prod.textContent = "Показать все товары";
        newList.append(all_prod);
        all_prod.addEventListener("click", () => {
          removeProducts.innerHTML = "";
          getProducts();
        });
      }
    }
    showProducts(list);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

filterProducts();

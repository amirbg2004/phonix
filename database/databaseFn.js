class Cart {
  totalPrice = 0;
  cartItems = [];
  constructor() {
    this.totalPrice = 0;
    this.cartItems = [];
  }
  addCartItem(product) {
    // searches if the product is in cart
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].product.itemID == product.itemID) {
        this.cartItems[i].quantity++;
        this.totalPrice += parseFloat(
          (
            product.itemPrice -
            (product.itemPrice * product.discount) / 100
          ).toFixed(2)
        );
        return;
      }
    }
    // if not found add it
    this.cartItems.push({
      quantity: 1,
      product: product,
    });
    if (!this.totalPrice) this.totalPrice = 0;
    this.totalPrice = parseFloat(
      (
        parseFloat(this.totalPrice) +
        parseFloat(product.itemPrice) -
        (parseFloat(product.itemPrice) * parseFloat(product.discount)) / 100
      ).toFixed(2)
    );
  }
}

class Account {
  firstName = "";
  lastName = "";
  email = "";
  password = "";

  cart = {};
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.cart = new Cart();
  }
}

class DataBase {
  constructor() {}
  // gets and returns the whole database
  static fetchDataBase = async (databaseURL = "../database/database.json") => {
    try {
      const response = await fetch(databaseURL);
      if (!response.ok) throw new Error("couldn't fetch the database");
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  };

  // returns an array of all the products
  static fetchAllProducts = async (
    databaseURL = "../database/database.json"
  ) => {
    try {
      return (await this.fetchDataBase(databaseURL)).products;
    } catch (err) {
      console.error(err);
    }
  };

  // returns the product with the specific id provided
  static fetchProductById = async (
    id,
    databaseURL = "../database/database.json"
  ) => {
    try {
      const products = (await this.fetchDataBase(databaseURL)).products;
      for (let i = 0; i < products.length; i++) {
        if (products[i].itemID.toLowerCase() == id.toLowerCase()) {
          return products[i];
        }
      }
      // throw new Error(`Product with ID: ${id} does not exist!`); // Debug
    } catch (err) {
      console.error(err);
    }
  };

  // returns an array with all the products having the type provided
  static fetchProductsByType = async (
    type,
    databaseURL = "../database/database.json"
  ) => {
    try {
      const products = (await this.fetchDataBase(databaseURL)).products;
      let array = [];
      for (let i = 0; i < products.length; i++) {
        if (products[i].itemType.toLowerCase() == type.toLowerCase()) {
          array.push(products[i]);
        }
      }
      // if(array.length == 0) throw new Error(`No product with type ${type} exist!`); // Debug
      return array;
    } catch (err) {
      console.error(err);
    }
  };

  // returns an array of products that have the 'search' in either name or description of the product
  static fetchSearch = async (
    search,
    databaseURL = "../database/database.json"
  ) => {
    try {
      const products = (await this.fetchDataBase(databaseURL)).products;
      let array = [];
      for (let i = 0; i < products.length; i++) {
        let textWithoutTags = products[i].itemDescription.replace(
          /<[^>]*>/g,
          ""
        );
        if (
          products[i].itemName.toLowerCase().includes(search.toLowerCase()) ||
          textWithoutTags.toLowerCase().includes(search.toLowerCase())
        ) {
          array.push(products[i]);
        }
      }
      // if(array.length == 0) throw new Error(`No product ${search} exist!`); // Debug
      return array;
    } catch (err) {
      console.error(err);
    }
  };
}

let databaseTemplate = {
  accounts: [],
  products: [
    {
      itemType: "",
      itemID: "",
      itemName: "",
      itemDescription: "",
      itemPrice: "",
      discount: "",
      stockQty: "",
      imageURL: [],
      color: [],
      rating: {},
    },
  ],
};

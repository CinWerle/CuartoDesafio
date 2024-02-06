const fs = require("fs");

class CartManager {
  constructor(path) {
    this.path = path;
    this.cart = [];
    this.lastId = 0;
  }

  async readArchive() {
    try {
      const answer = await fs.promises.readFile(this.path, "utf-8");
      const result = JSON.parse(answer);
      return result;
    } catch (error) {
      console.log("error al leer archivo", error);
      return this.cart;
    }
  }

  async saveArchive(newArray) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
    } catch (error) {
      console.error("Error en guardar el Archivo", error);
    }
  }

  async getCartById(id) {
    try {
      const newArray = await this.readArchive();
      const cart = await newArray.find((item) => item.id === id);

      if (!cart) {
        console.error("ID no se encuentra en Data");
      } else {
        return cart;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getCartProductById(cId, pId) {
    const product = await this.getCartById(cId);
    const productArray = product.product.findIndex(
      (item) => item.idProduct === pId
    );

    if (product && productArray !== -1) {
      return true;
    } else {
      return false;
      console.error("no existe uno de los datos");
    }
  }

  async addProducCarttById(cId, pId, newInformation) {
    const newProduct = {
      idProduct: pId,
      quantity: newInformation.quantity,
    };

    try {
      const arrayCart = await this.readArchive();
      const arrayAddProduct = arrayCart.map((cart) => {
        if (cart.id === cId) {
          return {
            ...cart,
            product: [...cart.product, newProduct],
          };
        } else {
          return cart;
        }
      });
      console.table(arrayAddProduct);
      await this.saveArchive(arrayAddProduct);
    } catch (error) {}
  }

  async updateCartById(cId, pId, newInformation) {
    try {
      const arrayCart = await this.readArchive();
      const arrayCartAfterUpdate = arrayCart.map((cart) => {
        if (cart.id === cId) {
          return {
            ...cart,
            product: cart.product.map((pd) =>
              pd.idProduct === pId
                ? { ...pd, quantity: pd.quantity + newInformation.quantity }
                : pd
            ),
          };
        } else {
          return cart;
        }
      });
      this.saveArchive(arrayCartAfterUpdate);
    } catch (error) {
      console.error("error al actualizar", error);
    }
  }

  async saveArchive(newArray) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(newArray, null, 2));
    } catch (error) {
      console.log("Error en guardar el archivo!!", error);
    }
  }
}

module.exports = CartManager;

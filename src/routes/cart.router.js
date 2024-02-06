const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager("./src/models/cart-data.json");

router.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const cart = await cartManager.getCartById(parseInt(id));

    if (!cart) {
      res.json({ error: "Carrito no encontrado" });
      return;
    } else {
      res.json(cart);
    }
  } catch (error) {
    console.error("Error al obtener product", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cId = req.params.cid;
  const pId = req.params.pid;
  const newInformation = req.body;

  if (!newInformation) {
    newInformation = {
      quantity: 1,
    };
  }
  try {
    if (await cartManager.getCartProductById(parseInt(cId), parseInt(pId))) {
      await cartManager.updateCartById(
        parseInt(cId),
        parseInt(pId),
        newInformation
      );
      res.status(201).json({ message: "Producto actualizado en carrito" });
    } else {
      await cartManager.addProducCarttById(
        parseInt(cId),
        parseInt(pId),
        newInformation
      );
      res
        .status(201)
        .json({ message: "Producto agrego un producto al carrito" });
    }
  } catch (error) {
    res.status(500).json({ error: "error del servidor" });
  }
});

module.exports = router;

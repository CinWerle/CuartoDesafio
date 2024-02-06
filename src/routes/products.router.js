const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductMangager.js");
const productManganer = new ProductManager("./src/models/product-data.json");

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManganer.getProducts();

    if (!limit) {
      res.json(productos);
      return;
    } else {
      res.json(productos.slice(0, limit));
    }
  } catch (error) {
    console.error("Ocurrio error al al llamar a los productos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const producto = await productManganer.getProductById(parseInt(id));

    if (!producto) {
      res.json({ error: "producto no encontrado" });
    } else {
      res.json(producto);
    }
  } catch (error) {
    console.error("Error al obtener producto", error);
    res.status(500).json({ error: "error del servidor" });
  }
});

router.post("", async (req, res) => {
  const newProduct = req.body;
  try {
    await productManganer.addProducts(newProduct);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "error del servidor" });
  }
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const update = req.body;

  try {
    await productManganer.updateProduct(parseInt(id), update);
    res.status(201).json({ message: "Producto modificado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "erro del servidor" });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManganer.deleteProduct(parseInt(id));
    res.status(201).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "erro del servidor" });
  }
});

module.exports = router;

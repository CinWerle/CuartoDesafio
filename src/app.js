const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");

// const productRouter = require("./routes/products.router.js");
// const cartRouter = require("./routes/cart.router.js");
// const exp = require("constants");

const viewRouter = require("./routes/views.router.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./src/public"));

//config handlebars

app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars");

app.set("views", "./src/views");

//Routes
// app.use("/api/products", productRouter);
// app.use("/api/carts", cartRouter);
app.use("/", viewRouter);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO} `);
});

const ProductManager = require("./controllers/ProductMangager.js");
const productManager = new ProductManager("./src/models/product-data.json");
const socket = require("socket.io");

const io = socket(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conecto");

  socket.emit("productos", await productManager.getProducts());

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    io.sockets.emit("productos", await productManager.getProducts());
  });

  socket.on("agregarProducto", async (producto) => {
    console.log(producto);
    await productManager.addProducts(producto);
    io.sockets.emit("producto", await productManager.getProducts());
  });
});

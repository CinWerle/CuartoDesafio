const socket = io();

socket.on("productos", (data) => {
  renderProduct(data);
});

const renderProduct = (products) => {
  const containerProduct = document.getElementById("containerProduct");
  containerProduct.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("m-5");

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title text-center">${item.title}</h5>
            <p class="card-text fw-bold">Descripción: ${item.description}</p>
            <span class="card-text text-danger">Precio: ${item.price}</p>
            <button type="button" class="btn btn-danger">Eliminar</button>
        </div>
    `;

    containerProduct.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("eliminarProducto", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
  agregarProducto();
});

const agregarProducto = () => {
  const producto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("img").value,
    code: document.getElementById("codigo").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("categoria").value,
    status: document.getElementById("status").value === "true",
  };
  socket.emit("agregarProducto", producto);
};

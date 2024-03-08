// Calculadora de propinas

// variables
const btnGuardar = document.querySelector("#guardar-cliente");
const mesaInput = document.querySelector("#mesa");
const horaInput = document.querySelector("#hora");

let Cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comida",
  2: "Bebidas",
  3: "Postres",
};

btnGuardar.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = mesaInput.value;
  const hora = horaInput.value;

  const camposVacios = [mesa, hora].some((campo) => campo === "");
  // Validar campos vacioes
  if (camposVacios) {
    mostrarAlerta("Todos los campos son Obligatorios");
    return;
  }

  // Copia de arreglo
  Cliente = { ...Cliente, mesa, hora };
  // console.log(Cliente)
  // Ocultar modal
  const modalFormulario = document.querySelector("#formulario");
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  // Mostrar las secciones
  mostrarSecciones();

  // Obtener platillos de api
  cargarPlatillos();
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}

function cargarPlatillos() {
  const url = `http://localhost:3000/platillos`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      mostrarPlatos(data);
    })
    .catch((e) => console.error(e));
}

function mostrarPlatos(platos) {
  const contenido = document.querySelector("#platillos .contenido");

  platos.forEach((plato) => {
    const { id, nombre, precio, categoria } = plato;
    const row = document.createElement("div");
    row.classList.add("row", "py-3", "border-top");

    const name = document.createElement("div");
    name.classList.add("col-md-4");
    name.textContent = nombre;

    const price = document.createElement("div");
    price.classList.add("col-md-3", "fw-bold");
    price.textContent = formatearMoneda(precio);

    const category = document.createElement("div");
    category.classList.add("col-md-3");
    category.textContent = categorias[`${categoria}`];

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${id}`;
    inputCantidad.classList.add("form-control");

    // cantidad del platillo agregado
    inputCantidad.onchange = function () {
      const cantidad = Number(inputCantidad.value);
      agregarPlatillo({ ...plato, cantidad });
    };

    const agregar = document.createElement("div");
    agregar.classList.add("col-md-2");

    agregar.appendChild(inputCantidad);
    row.appendChild(name);
    row.appendChild(price);
    row.appendChild(category);
    row.appendChild(agregar);
    contenido.appendChild(row);
  });
}

function agregarPlatillo(datos) {
  let { pedido } = Cliente;

  const existe = pedido.some((p) => p.id === datos.id);

  if (datos.cantidad > 0) {
    // Comprobar si el platillo ya esta en el carrito...
    if (existe) {
      // Iterar para actualizar la cantidad
      const pedidoActualizado = pedido.map((articulo) => {
        if (articulo.id === datos.id) {
          articulo.cantidad = datos.cantidad;
        }
        return articulo;
      });

      // Se asigna al array
      Cliente.pedido = [...pedidoActualizado];
    } else {
      // En caso de que el articulo no exista, es nuevo y se agrega
      Cliente.pedido = [...pedido, datos];
    }
  } else {
    const resultado = pedido.filter((articulo) => articulo.id !== datos.id);
    // console.log(resultado)
    Cliente.pedido = resultado;
  }

  // Revisar si el arreglo
  if (Cliente.pedido.length) {
    // Mostrar Resumen
    mostrarResumen();
  } else {
    mensajePedidoVacio();
  }
}

function mostrarResumen() {
  const contenido = document.querySelector("#resumen .contenido");
  limpiarHtml(contenido);
  const resumen = document.createElement("div");
  resumen.classList.add("col-md-6", "card", "py-5", "px-3", "shadow");

  // mesa info
  const mesa = document.createElement("p");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");
  const mesaSpan = document.createElement("span");
  mesaSpan.textContent = Cliente.mesa;
  mesaSpan.classList.add("fw-normal");
  mesa.appendChild(mesaSpan);
  // Hora info
  const hora = document.createElement("p");
  hora.textContent = "hora: ";
  hora.classList.add("fw-bold");
  const horaSpan = document.createElement("span");
  horaSpan.textContent = Cliente.hora;
  horaSpan.classList.add("fw-normal");
  hora.appendChild(horaSpan);

  // Titulo de la sección
  const heading = document.createElement("h3");
  heading.textContent = "Platos Consumidos";
  heading.classList.add("my-4", "fw-bold", "text-center");

  // iterar sobreo el arreglo de pedidos
  const grupo = document.createElement("ul");
  grupo.classList.add("list-group");
  const { pedido } = Cliente;
  pedido.forEach((el) => {
    const { nombre, cantidad, precio, id } = el;

    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const nombreEl = document.createElement("p");
    nombreEl.textContent = nombre;
    nombreEl.classList.add("my-4");

    const cantidadEl = document.createElement("p");
    cantidadEl.textContent = "Cantidad: ";
    cantidadEl.classList.add("my-4", "fw-bold");
    const cantidadSpan = document.createElement("span");
    cantidadSpan.textContent = cantidad;
    cantidadEl.appendChild(cantidadSpan);

    const precioEl = document.createElement("p");
    precioEl.textContent = "Precio: ";
    precioEl.classList.add("my-4", "fw-bold");
    const precioSpan = document.createElement("span");
    precioSpan.textContent = formatearMoneda(precio);
    precioEl.appendChild(precioSpan);

    // subtotal articulo
    const subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal: ";
    subtotal.classList.add("my-4", "fw-bold");
    const subtotalSpan = document.createElement("span");
    subtotalSpan.textContent = calcularSubtotal(precio, cantidad);
    subtotal.appendChild(subtotalSpan);

    // Botón pra eliminar
    const btnEliminar = document.createElement("btn");
    btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
    btnEliminar.textContent = "Eliminar";

    // funcion eliminar pedido
    btnEliminar.onclick = () => {
      removerPedido(id);
    };

    // agregar elementos al li
    li.appendChild(nombreEl);
    li.appendChild(cantidadEl);
    li.appendChild(precioEl);
    li.appendChild(subtotal);
    li.appendChild(btnEliminar);

    // agregar lista al grupo
    grupo.appendChild(li);
  });

  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(grupo);
  contenido.appendChild(resumen);

  // Mostrar formulario de propinas
  formularioPropinas();
}

function formularioPropinas() {
  const contenido = document.querySelector("#resumen .contenido");
  const formulario = document.createElement("div");
  formulario.classList.add("col-md-6", "formulario");
  const divFormulario = document.createElement("div");
  divFormulario.classList.add("card", "shadow", "py-5", "px-3");
  const heading = document.createElement("h3");
  heading.classList.add("my-4", "mx-4", "fw-bold", "text-center");
  heading.textContent = "Propina";

  // RadioButtons 10% - 18%
  // 10%
  const radio10 = document.createElement("input");
  radio10.type = "radio";
  radio10.name = "propina";
  radio10.value = 10;
  radio10.classList.add("form-check-input");
  // Calculamos propinas
  radio10.onclick = () => calcularPropina();

  const label10 = document.createElement("label");
  label10.textContent = "10%";
  label10.classList.add("form-check-label");

  const radio10Div = document.createElement("div");
  radio10Div.classList.add("form-check");

  // 18%
  const radio18 = document.createElement("input");
  radio18.type = "radio";
  radio18.name = "propina";
  radio18.value = 18;
  radio18.classList.add("form-check-input");
  // Calcular Propinas
  radio18.onclick = () => calcularPropina();

  const label18 = document.createElement("label");
  label18.textContent = "18%";
  label18.classList.add("form-check-label");

  const radio18div = document.createElement("div");
  radio18div.classList.add("form-check");

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(label10);
  radio18div.appendChild(radio18);
  radio18div.appendChild(label18);

  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio18div);
  formulario.appendChild(divFormulario);
  contenido.appendChild(formulario);
}

function removerPedido(id) {
  const { pedido } = Cliente;
  const resultado = pedido.filter((p) => p.id !== id);
  Cliente.pedido = [...resultado];

  if (Cliente.pedido.length) {
    mostrarResumen();
  } else {
    mensajePedidoVacio();
  }

  // El producto se elimino resetamos la cantidad a 0
  const elementoEliminado = `#producto-${id}`;
  const inputEliminado = document.querySelector(elementoEliminado);
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector("#resumen .contenido");
  limpiarHtml(contenido);
  const texto = document.createElement("p");
  texto.classList.add("text-center");
  texto.textContent = "Añade los elementos del pedido";

  contenido.appendChild(texto);
}

function calcularSubtotal(precio, cantidad) {
  return formatearMoneda(precio * cantidad);
}

function mostrarAlerta(mensaje) {
  const alerta = document.querySelector(".invalid-feedback");
  if (alerta) return;
  const alertaDiv = document.createElement("div");
  alertaDiv.classList.add("invalid-feedback", "d-block", "text-center");
  alertaDiv.textContent = mensaje;
  document.querySelector(".modal-body form").appendChild(alertaDiv);

  setTimeout(() => {
    alertaDiv.remove();
  }, 2000);
}

function calcularPropina() {
  const { pedido } = Cliente;
  let subtotal = 0;

  pedido.forEach((el) => {
    subtotal += el.cantidad * el.precio;
  });

  // tomamos el input seleccionado
  const propinaSelect = document.querySelector(
    "[name='propina']:checked"
  ).value;

  const propina = subtotal * Number(propinaSelect / 100);
  const total = subtotal + propina;

  mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina) {
  const propinaFixed = propina.toFixed(2);
  // contenedor
  const contenedor = document.createElement("div");
  contenedor.classList.add("total-pagar","mt-4");
  // Subtotal
  const subtotalP = document.createElement("p");
  subtotalP.classList.add("fs-4", "fw-bold", "mt-2");
  subtotalP.textContent = "Subtotal: ";
  const subtotalSpan = document.createElement("span");
  subtotalSpan.classList.add("fw-normal");
  subtotalSpan.textContent = formatearMoneda(subtotal);
  // Propina
  const propinaP = document.createElement("p");
  propinaP.classList.add("fs-4", "fw-bold", "mt-2");
  propinaP.textContent = "Propina: ";
  const propinaSpan = document.createElement("span");
  propinaSpan.classList.add("fw-normal");
  propinaSpan.textContent = formatearMoneda(propinaFixed);
  // Total
  const totalP = document.createElement("p");
  totalP.classList.add("fs-4", "fw-bold", "mt-2");
  totalP.textContent = "Total Pagar: ";
  const totalSpan = document.createElement("span");
  totalSpan.classList.add("fw-normal");
  totalSpan.textContent = formatearMoneda(total);

  // Eliminar el ultimo resultado
  const totalPagarDiv = document.querySelector('.total-pagar')
  if(totalPagarDiv){
    totalPagarDiv.remove()
  }

  subtotalP.appendChild(subtotalSpan);
  propinaP.appendChild(propinaSpan);
  totalP.appendChild(totalSpan)
  contenedor.appendChild(subtotalP);
  contenedor.appendChild(propinaP);
  contenedor.appendChild(totalP)
  const formulario = document.querySelector(".formulario > div");
  formulario.appendChild(contenedor);
}

function formatearMoneda(moneda) {
  return moneda.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

function limpiarHtml(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

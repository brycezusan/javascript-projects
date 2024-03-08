// Buscador de imagenes pixabay

const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const buscador = document.querySelector(".buscador");
const paginadorContent = document.querySelector("#paginacion");

const elementsPage = 20;
let totalPaginas;
let iterador;
let pagActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", handleSubmit);
};

function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(e.target);
  const busqueda = data.get("busqueda");

  if (busqueda == "") {
    // console.log("no valido");
    mostrarError("Campo Obligatorio", "error");
    return;
  }
  // buscamos la imagen
  buscarImagen();
}

function mostrarError(mensaje, tipo) {
  const div = document.createElement("div");
  div.classList.add(
    "w-full",
    "my-4",
    "py-2",
    "text-center",
    "uppercase",
    "text-white",
    "font-semibold"
  );
  div.textContent = mensaje;
  if (tipo === "error") {
    div.classList.add("bg-red-500");
  }
  buscador.insertBefore(div, formulario);

  setTimeout(() => {
    div.remove();
  }, 2000);
}

function buscarImagen() {
  const busqueda = formulario.querySelector("#termino").value;

  const url = `https://pixabay.com/api/?key=42566156-961022d37c9f8fdbe9a31eccc&q=${busqueda}&image_type=photo&page=${pagActual}`;

  fetch(url)
    .then((res) => res.json())
    .then(({ hits, total }) => {
      totalPaginas = calcularPaginas(total);
      mostrarHtml(hits);
    })
    .catch((e) => console.error(e));
}

// generador de  la cantidad de elementos por pagina
function* crearPaginador(total) {
  for (let index = 1; index <= total; index++) {
    // console.log(index)
    yield index;
  }
}

function calcularPaginas(total) {
  return Math.ceil(total /   elementsPage );
}

function mostrarHtml(resultados) {
  limpiarHtml(resultado);
  resultados.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("rounded-lg", "overflow-hidden");
    const cardContent = document.createElement("div");
    cardContent.classList.add("py-2", "px-8", "bg-white");
    const cta = document.createElement("a");
    cta.classList.add(
      "p-2",
      "bg-red-400",
      "text-white",
      "text-center",
      "font-semibold",
      "rounded",
      "block",
      "w-full",
      "my-4",
      "hover:bg-red-300",
      "transition"
    );
    cta.textContent = "Imagen completa";
    cta.href = `${r.largeImageURL}`;
    cta.target = "_blank";
    const p = document.createElement("p");
    const p2 = document.createElement("p");
    p.textContent = ` ${r.likes} me gusta 💝 `;
    p2.textContent = `${r.views} vistas 👀 `;
    p.classList.add("text-center", "font-bold");
    p2.classList.add("text-center", "font-bold");
    const img = document.createElement("img");
    img.classList.add("object-cover", "h-64", "w-full");
    img.src = `${r.previewURL}`;
    cardContent.appendChild(p);
    cardContent.appendChild(p2);
    cardContent.appendChild(cta);
    card.appendChild(img);
    card.appendChild(cardContent);

    resultado.appendChild(card);
  });

  imprimirPaginador();
}

function imprimirPaginador() {
  limpiarHtml(paginadorContent);
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();

    if (done) return;

    const btn = document.createElement("a");
    btn.href = "#";
    btn.textContent = value;
    btn.dataset.pagina = value;
    btn.classList.add(
      "next",
      "bg-yellow-400",
      "font-semibold",
      "px-3",
      "py-1",
      "mb-6",
      "mr-2",
      "rounded"
    );

    btn.onclick = () => {
      pagActual = value;
      buscarImagen()
    };

    paginadorContent.appendChild(btn);
  }
}

function limpiarHtml(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

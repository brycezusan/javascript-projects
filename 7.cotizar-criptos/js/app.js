// crypto compare - transformar cryptos
//
const formulario = document.querySelector("#formulario");
const cambio = document.querySelector("#moneda");
const criptos = document.querySelector("#criptomonedas");
const resultado = document.querySelector("#resultado");

let dataBusqueda = {
  moneda: "",
  criptoMoneda: "",
};

document.addEventListener("DOMContentLoaded", () => {
  llenarCriptos();
  cambio.addEventListener("change", (e) => {
    dataBusqueda.moneda = e.target.value;
  });
  criptos.addEventListener("change", (e) => {
    dataBusqueda.criptoMoneda = e.target.value;
  });
  formulario.addEventListener("submit", handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();

    if (Object.values(dataBusqueda).includes("")) {
      mostrarError("Campos Obligatorios");
      return;
    }
    // Hacemos la busqueda

    buscarCotizaciones();
  }
});

function buscarCotizaciones() {
  const { moneda, criptoMoneda } = dataBusqueda;
  mostrarSpinner();
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptoMoneda}&tsyms=${moneda}`;
  fetch(url)
    .then((res) => res.json())
    .then(({ DISPLAY }) => {
      const resultados = DISPLAY[criptoMoneda][moneda];
      llenarResultados(resultados);
    })
    .catch((e) => console.error(e));
  console.log(error);
}

function llenarResultados(data) {
  limpiarHtml();
  const { CHANGEDAY, HIGHDAY, LASTUPDATE, LOWDAY, PRICE } = data;
  const divResultado = document.createElement("div");
  divResultado.style.flex = "flex";
  divResultado.style.flexDirection = "column";
  divResultado.style.gap = "12px";
  divResultado.style.paddingTop = "12px";
  divResultado.innerHTML = `
    <h4>El precio es de: <span>${PRICE}</span></h4>
    <p>El precio mayor del dia: <span>${HIGHDAY}</span></p>
    <p>El precio menor del dia: <span>${LOWDAY}</span></p>
    <p>Actualización: <span>${LASTUPDATE}</span></p>
    <p>Cambio del dia: <span>${CHANGEDAY}</span></p>
  `;

  resultado.appendChild(divResultado);
}

function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function llenarCriptos() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

  fetch(url)
    .then((res) => res.json())
    .then(({ Data }) => {
      llenarSelectCriptos(Data);
    })
    .catch((e) => console.error(e));
}

function llenarSelectCriptos(datos) {
  datos.forEach((element) => {
    const option = document.createElement("option");
    option.value = element.CoinInfo.Name;
    option.textContent = element.CoinInfo.FullName;

    criptos.appendChild(option);
  });
}

function mostrarSpinner() {
  const divSpinner = document.createElement("div");
  divSpinner.style.flex = "flex";
  divSpinner.style.justifyContent = "center";
  divSpinner.style.paddingBlock = "12px";
  divSpinner.innerHTML = `
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `;

  resultado.appendChild(divSpinner);
}

function mostrarError(mensaje) {
  const div = document.createElement("div");
  div.textContent = mensaje;
  div.classList.add("error");

  formulario.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}

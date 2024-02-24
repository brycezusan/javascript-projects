// Clima App - API

//variables o select
const containter = document.querySelector(".container");
const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const api = "eca5fdbc70d066b018bf98df2d4481f4";
let busqueda = {};
let datos;

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

// funciones
function buscarClima(e) {
  e.preventDefault();

  const data = new FormData(e.target);
  const ciudad = data.get("ciudad");
  const pais = data.get("pais");

  Object.assign(busqueda, {
    ciudad,
    codPais: pais,
  });

  // validacion
  if (Object.values(busqueda).includes("")) {
    mostrarError("Campos Obligatorios", "error");
    return;
  }
  consultarApi();
}

function mostrarError(mensaje, tipo) {
  const div = document.createElement("div");
  div.textContent = mensaje;
  div.classList.add(
    "block",
    "text-center",
    "text-white",
    "py-2",
    "rounded",
    "mt-4"
  );

  if (tipo === "error") {
    div.classList.add("bg-red-400");
  }

  containter.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}

function consultarApi() {
  const { ciudad, codPais } = busqueda;
  let datosBusqueda;

  spinner() /* Spinner de carga*/

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${codPais}&appid=${api}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      datosBusqueda = data;
      buscarTiempo(datosBusqueda);
    })
    .catch((e) => console.error(e));
}

function buscarTiempo(data) {
  const { lat, lon } = data[0];
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;

  fetch(url)
    .then((res) => res.json())
    .then((datos) => {
      mostrarClima(datos);
    })
    .catch((e) => console.error(e));
}

function mostrarClima(datos) {
  limiarHTML();
  // devuelve en grados kelvin
  // convertir de kelvin a centigrados K - 273.15
  const {
    main: { temp, temp_max, temp_min, name },
  } = datos;
  const centigrados = convertirGrados(temp);
  const maximo = convertirGrados(temp_max);
  const minimo = convertirGrados(temp_min);

  const ciudad = document.createElement("h2");
  ciudad.innerHTML = `
    ${datos.name}
  `;
  ciudad.classList.add("text-center", "font-semibold", "text-3xl");

  const temperatura = document.createElement("p");
  temperatura.innerHTML = `
    ${centigrados} &#8451; 
  `;
  temperatura.classList.add("font-bold", "text-5xl");

  const divmaxmin = document.createElement("div");
  divmaxmin.classList.add(
    "flex",
    "justify-between",
    "text-2xl",
    "font-semibold",
    "text-white"
  );

  const max = document.createElement("p");
  max.innerHTML = `Max: ${maximo} &#8451`;
  const min = document.createElement("p");
  min.innerHTML = `Min: ${minimo} &#8451`;

  divmaxmin.appendChild(max);
  divmaxmin.appendChild(min);

  const resultadoDiv = document.createElement("div");
  resultadoDiv.classList.add("text-center", "text-white");
  resultadoDiv.appendChild(ciudad);
  resultadoDiv.appendChild(temperatura);

  resultado.appendChild(resultadoDiv);
  resultado.appendChild(divmaxmin);
}

const convertirGrados = (valor) => {
  return Math.round(valor - 273.15);
};

function limiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner() {
  limiarHTML()
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("sk-fading-circle");
  divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  `;

  resultado.appendChild(divSpinner)
}

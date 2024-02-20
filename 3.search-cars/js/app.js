// Search car for  features

// Variables
const resultado = document.querySelector("#resultado");
const buscador = document.querySelector("#buscador");

// variables de años
const year = document.querySelector("#year");
const max = new Date().getFullYear();
const min = max - 10;

// variables de caracteristicas
const precioMin = document.querySelector("#minimo");
const precioMax = document.querySelector("#maximo");
const puertas = document.querySelector("#puertas");
const color = document.querySelector("#color");
const transmision = document.querySelector("#transmision");

// Objecto para la busqueda
const searhData = {
  marca: "",
  year: "",
  puertas: "",
  min: "",
  max: "",
  puertas: "",
  tipo: "",
  color: "",
};

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  mostrarAutos(autos);
  llenarSelect();
});

// Listeners
marca.addEventListener("change", (e) => {
  searhData.marca = e.target.value;
  filtrarAuto();
});

color.addEventListener("change", (e) => {
  searhData.color = e.target.value;
  filtrarAuto();
});

year.addEventListener("change", (e) => {
  searhData.year = e.target.value;
  filtrarAuto();
});

transmision.addEventListener("change", (e) => {
  searhData.tipo = e.target.value;
  filtrarAuto();
});

puertas.addEventListener("change", (e) => {
  searhData.puertas = e.target.value;
  filtrarAuto();
});

precioMax.addEventListener("change", (e) => {
  searhData.max = e.target.value;
  filtrarAuto();
});

precioMin.addEventListener("change", (e) => {
  searhData.min = e.target.value;
  filtrarAuto();
});

// Funciones
function mostrarAutos(autos) {
  limpiarHTML();
  // Tomamos los autos
  autos.forEach((auto) => {
    const { color, marca, modelo, precio, puertas, transmision, year } = auto;
    const autoParrafo = document.createElement("p");
    autoParrafo.textContent = `
      ${marca} - ${modelo} - ${color} - ${puertas} puertas -${transmision} - ${year} - ${formatCurrency(
      precio
    )}
      `;
    resultado.appendChild(autoParrafo);
  });
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarError(){
  limpiarHTML()
  const div = document.createElement('div')
  div.classList.add('error')
  div.textContent = 'Sin resultados'
  div.style.color='white'
  div.style.textAlign='center'
  div.style.paddingBlock='40px'
  div.style.fontSize='36px'

  resultado.appendChild(div)
  
}

function formatCurrency(precio) {
  return precio.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

function llenarSelect() {
  for (let i = max; i >= min; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    year.appendChild(option);
  }
}
// Funcion de alto orden
function filtrarAuto() {
  const results = autos
    .filter(filtrarMarca)
    .filter(filtrarYear)
    .filter(filtrarMin)
    .filter(filtarMaximo)
    .filter(filtrarPuertas)
    .filter(filtrarTipo)
    .filter(filtrarColor);


  if(results.length ===0 ){
    mostrarError()
  }else{
    // llenamos nuestro html
    mostrarAutos(results);
  }
}

function filtrarMarca(auto) {
  if (searhData.marca) {
    return auto.marca === searhData.marca;
  } else {
    return auto;
  }
}

function filtrarYear(auto) {
  if (searhData.year) {
    return auto.year === Number(searhData.year);
  } else {
    return auto;
  }
}

function filtrarMin(auto) {
  if (searhData.min) {
    return auto.precio >= searhData.min;
  }

  return auto
}

function filtarMaximo(auto) {
  if (searhData.max) {
    return auto.precio <= searhData.max;
  } else {
    return auto;
  }
}

function filtrarPuertas(auto) {
  if (searhData.puertas) {
    return auto.puertas === Number(searhData.puertas);
  }

  return auto
}

function filtrarTipo(auto) {
  if (searhData.tipo) {
    return auto.transmision === searhData.tipo;
  }

  return auto
}

function filtrarColor(auto) {
  if (searhData.color) {
    return auto.color === searhData.color;
  }

  return auto
}

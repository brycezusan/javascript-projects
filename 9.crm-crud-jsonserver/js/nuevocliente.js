import { nuevoCliente } from "./API.js";
import { mostrarAlerta } from "./funciones.js";

// Variables
const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", handleSubmit);

let datosForm = {
  nombre: "",
  email: "",
  telefono: "",
  empresa: "",
};

function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(e.target);
  const nombre = data.get("nombre");
  const email = data.get("email");
  const telefono = data.get("telefono");
  const empresa = data.get("nombre");

  Object.assign(datosForm, {
    nombre,
    email,
    telefono,
    empresa,
  });

  if (Object.values(datosForm).includes("")) {
    mostrarAlerta("Todos los campos son Obligatorios");
    return;
  }

  // pasamos a enviar los datos del formulario
  nuevoCliente(datosForm);
}

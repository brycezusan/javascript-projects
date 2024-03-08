import { editarCliente, obtenerCliente } from "./API.js";
import { mostrarAlerta } from "./funciones.js";
(function () {
  // variables
  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");
  const idInput = document.querySelector("#id");

  // obtener el id de registro
  document.addEventListener("DOMContentLoaded", async () => {
    const parametroUrl = new URLSearchParams(window.location.search);
    const idCliente = parametroUrl.get("id");

    const cliente = await obtenerCliente(idCliente);
    mostrarCLiente(cliente);

    // enviar el formulario
    const formulario = document.querySelector("#formulario");
    formulario.addEventListener('submit',validarFormulario)

    function mostrarCLiente(cliente) {
      const { nombre, empresa, email, telefono, id } = cliente;

      nombreInput.value = nombre;
      empresaInput.value = empresa;
      emailInput.value = email;
      telefonoInput.value = telefono;
      idInput.value = id;
    }

    function validarFormulario(e){
      e.preventDefault()
      const cliente = {
        nombre: nombreInput.value,
        empresa:empresaInput.value,
        id:idInput.value,
        email:emailInput.value,
        telefono:telefonoInput.value
      }

      if(Object.values(cliente).includes('')){
        mostrarAlerta('Todos los campos son obligatorios')
        return
      }

      // Modificar o actualizar el registro
      editarCliente(cliente)

    }

  });
})();

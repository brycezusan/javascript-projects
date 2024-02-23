// administrar citas
// Gestionar citas

// variables
const formulario = document.querySelector("#nueva-cita");
const listaCitas = document.querySelector("#citas");
let datosFormulario = {};
let editando;

// listeners

eventListeners();
function eventListeners() {
  formulario.addEventListener("submit", onsubmit);
}

// Clases
class Citas {
  constructor() {
    this.turnos = [];
  }

  // METODOS
  agregarCita(cita) {
    this.turnos = [...this.turnos, cita];
  }
  deleteCita(id) {
    this.turnos = this.turnos.filter((t) => t.id !== id);
  }
  editarCita(citaActualizar){
    this.turnos = this.turnos.map( turno=> turno.id === citaActualizar.id ? citaActualizar : turno)
  }
}

class UI {
  // METODOS
  mostrarAlerta(mensaje, tipo) {
    const div = document.createElement("div");
    div.textContent = mensaje;
    div.classList.add("text-center", "alert", "d-block", "col-12");
    div.role = "alert";

    if (tipo == "error") {
      div.classList.add("alert-danger");
    } else {
      div.classList.add("alert-warning");
    }

    // agregar el mensaje al DOM
    document
      .querySelector("#contenido")
      .insertBefore(div, document.querySelector(".agregar-cita"));

    setTimeout(() => {
      div.remove();
    }, 2000);
  }

  mostrarCitas(citas) {
    this.limpiarHtml();

    citas.forEach((date) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        date;
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      // Scripting parrafos de la cita
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;
      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;
      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
      `;

      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.classList.add("btn", "btn-warning");
      btnEliminar.innerHTML = "🔥";
      btnEliminar.dataset.id = id;

      btnEliminar.onclick = () => eliminarCita(id);

      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.classList.add("btn", "btn-primary");
      btnEditar.innerHTML = "✏️";
      btnEditar.dataset.id = id;
      btnEditar.onclick = () => editarCita(date);

      // agregadomos al div
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // agregamos a la lista de citas
      listaCitas.appendChild(divCita);
    });
  }

  limpiarHtml() {
    while (listaCitas.firstChild) {
      listaCitas.removeChild(listaCitas.firstChild);
    }
  }
}

// Instanciar las clases
let ui = new UI();
const administraCitas = new Citas();

// funciones
function onsubmit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  const mascota = data.get("mascota");
  const propietario = data.get("propietario");
  const telefono = data.get("telefono");
  const fecha = data.get("fecha");
  const hora = data.get("hora");
  const sintomas = data.get("sintomas");

  Object.assign(datosFormulario, {
    mascota,
    propietario,
    telefono,
    fecha,
    hora,
    sintomas,
  });

  console.log(datosFormulario)

  if (Object.values(datosFormulario).includes("")) {
    ui.mostrarAlerta("Todos los campos son Obligatorios", "error");
    return;
  }

  if (editando) {
    ui.mostrarAlerta('Turno actualizado')
    administraCitas.editarCita({...datosFormulario})
    document.querySelector('button[type="submit"]').textContent = "Crear Cita";
    editando = false

  } else {
    datosFormulario.id = Date.now();
    // registramos las cita
    administraCitas.agregarCita({ ...datosFormulario });
    ui.mostrarAlerta("Turno creado correctamente");
  }

  // Reseteamos el formulario
  formulario.reset();

  // Reiniciamos el objeto
  Object.assign(datosFormulario, {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
    id: null,
  });

  // Mostramos las citas en el HTML
  ui.mostrarCitas(administraCitas.turnos);
}

function eliminarCita(id) {
  administraCitas.deleteCita(id);
  ui.mostrarAlerta("La cita se eliminó correctamente");
  ui.mostrarCitas(administraCitas.turnos);
}

function editarCita(date) {
  const { id, mascota, propietario, telefono, fecha, hora, sintomas } = date;
  // LLenar los inputs
  document.querySelector("#mascota").value = mascota;
  document.querySelector("#propietario").value = propietario;
  document.querySelector("#telefono").value = telefono;
  document.querySelector("#fecha").value = fecha;
  document.querySelector("#hora").value = hora;
  document.querySelector("#sintomas").value = sintomas;

  // actualizamos texto de boton
    document.querySelector('button[type="submit"]').textContent = "Editar Cita";

  // LLenar el objeto
  Object.assign(datosFormulario, {
    mascota,
    propietario,
    telefono,
    hora,
    fecha,
    sintomas,
    id,
  });

  editando = true;

}

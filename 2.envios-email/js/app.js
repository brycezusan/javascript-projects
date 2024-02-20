//email simulator sending

// Listeners
// Carga del dom
document.addEventListener("DOMContentLoaded", () => {
  const email = {
    email: "",
    asunto: "",
    mensaje: "",
  };
  // Seleccionar los elementos
  const inputEmail = document.querySelector("#email");
  const asunto = document.querySelector("#asunto");
  const mensaje = document.querySelector("#mensaje");
  const reset = document.querySelector("#formulario button[type='reset']");
  const formulario = document.querySelector("#formulario");
  const spinner = document.querySelector("#spinner");
  const btn = document.querySelector(".bg-pink-600");

  inputEmail.addEventListener("blur", validarEmail);
  asunto.addEventListener("blur", validarCampo);
  mensaje.addEventListener("blur", validarCampo);
  formulario.addEventListener("submit", enviarEmail);

  reset.addEventListener("click", (e) => {
    e.preventDefault();
    // 1 forma
    // email.email=''
    // email.asunto=''
    // email.mensaje=''

    // 2forma
    Object.assign(email, {
      email: "",
      asunto: "",
      mensaje: "",
    });

    formulario.reset();
    comprobarFormulario();
  });

  function enviarEmail(e) {
    e.preventDefault();

    spinner.classList.remove("hidden");
    
    setTimeout(() => {
      spinner.classList.add("hidden");
      btn.classList.add("opacity-50");
      formulario.reset();
      
      // alerta de exito
      const alertaExito = document.createElement("p");
      alertaExito.classList.add(
        "bg-green-500",
        "text-white",
        "p-2",
        "text-center",
        "rounded",
        "mt-10",
        "font-bold",
        "uppercase",
        "text-sm"
      );
      alertaExito.textContent = 'Data enviada correctamente'
      formulario.appendChild(alertaExito)

      setTimeout(() => {
        alertaExito.remove()
      }, 3000);

    }, 2000);

   

  }

  function validarEmail(e) {
    const correo = e.target.value;
    const referencia = e.target.parentElement;

    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (correo === "") {
      alerta(`El campo ${e.target.id} es obligatorio`, referencia);
      email[e.target.name] = "";
    } else if (correo.match(regex)) {
      removeError(referencia);
    } else {
      alerta("ingrese un correo valido ", referencia);
    }

    email[e.target.name] = correo.trim().toLowerCase();

    comprobarFormulario();
  }

  function validarCampo(e) {
    const texto = e.target.value.trim();
    const referencia = e.target.parentElement;
    if (texto === "") {
      alerta(`El campo ${e.target.id} es obligatorio`, referencia);
      email[e.target.name] = "";
    } else {
      removeError(referencia);
      email[e.target.name] = texto;
    }

    comprobarFormulario();
  }

  function alerta(mensaje, referencia) {
    removeError();
    const errorDiv = document.createElement("div");
    errorDiv.textContent = mensaje;
    errorDiv.style.marginBlock = "8px";
    errorDiv.style.backgroundColor = "red";
    errorDiv.style.padding = "5px";
    errorDiv.style.textAlign = "center";
    errorDiv.style.color = "white";
    errorDiv.classList.add("rounded", "font-bold", "uppercase", "error");
    referencia.appendChild(errorDiv);
  }

  function removeError() {
    const campoError = document.querySelector(".error");
    if (campoError) {
      campoError.remove();
    }
  }

  function comprobarFormulario() {
    if (Object.values(email).includes("")) {
      btn.classList.add("opacity-50");
      btn.disabled = true;
    } else {
      btn.classList.remove("opacity-50");
      btn.disabled = false;
    }
  }
});

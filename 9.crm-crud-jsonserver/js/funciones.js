export function mostrarAlerta(mensaje) {

  const alerta= document.querySelector('.bg-red-100')

  if (!alerta) {
    const alertaEle = document.createElement("div");
    alertaEle.classList.add(
      "bg-red-100",
      "border",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-2",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "text-center",
      "mt-2"
    );
    alertaEle.innerHTML = `
     <strong class="font-bold">Error!</strong>
     <span class="block sm:inline">${mensaje}</span> 
    `;

    setTimeout(() => {
      alertaEle.remove()
    }, 2000);

    const formulario = document.querySelector("#formulario");
    formulario.appendChild(alertaEle);
  }
}

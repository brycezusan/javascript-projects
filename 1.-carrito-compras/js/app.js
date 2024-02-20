// App - Carrito de Compras

// variables
const cart = document.querySelector("#carrito");
const contentCart = document.querySelector("#lista-carrito tbody");
const emptyBtn = document.querySelector("#vaciar-carrito");
const listCourses = document.querySelector("#lista-cursos");

let shoppingCart = [];

// load listeners function declaration
loadListeners();
function loadListeners() {
  // add to shopping cart
  listCourses.addEventListener("click", addItemCourse);
  // remove to shopping cart
  cart.addEventListener('click', deleteCourse)
  // Clean shopping cart
  cart.addEventListener('click', cleanShoppingCart)
}

// Functions
function addItemCourse(e ) {
  e.preventDefault();
  // prevent bubbling for declaration
  if (e.target.classList.contains("agregar-carrito")) {
    const selectCourse = e.target.parentElement.parentElement;
    readataCourse(selectCourse);
  }
}

// Lee el contenido del HTML y extrae la info
function readataCourse(course) {
  // Creamos un objeto con el contenido del curso recibido
  const infoCourse = {
    imagen: course.querySelector("img").src,
    title: course.querySelector("h4").textContent,
    price: course.querySelector(".precio span").textContent,
    id: course.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // Comprobamos si existe en el carrito
  const existe = shoppingCart.some((c) => c.id === infoCourse.id);

  if (existe) {
    // Actualizamos la cantidad
    console.log("aumenta la cantidad");
    const courses = shoppingCart.map((c) => {
      if (c.id === infoCourse.id) {
        c.cantidad++;
        return c
      }else{
        return c
      }
    });

    alert('ya se encuentra agregado al carrito')
    shoppingCart = [...courses]
  } else {
    // LLenamos el carrito con el objeto
    shoppingCart = [...shoppingCart, infoCourse];
  }

  // console.log(shoppingCart)
  mostrarCarrito();
}

// Mostrar el carrito de compras
function mostrarCarrito() {
  // Limpiar el HTML
  cleanCartHtml();
  // Generar html
  shoppingCart.forEach((curso) => {
    const row = document.createElement("tr");
    const { imagen, title, price, cantidad, id } = curso;
    row.innerHTML = `
      <td>
        <img src="${imagen}" width=90px height='auto'/>
      </td>
      <td>${title}</td>
      <td>${price}</td>
      <td>${cantidad}</td>
      <td>
        <a  href='#' class='borrar-curso' data-id="${id}"> X </a>
      </td>
    `;
    // agregar el html del carrito
    contentCart.appendChild(row);
  });
}

function cleanCartHtml() {
  // 1 forma más lento
  // contentCart.innerHTML = ''
  // 2 forma más rapido
  while (contentCart.firstChild) {
    contentCart.removeChild(contentCart.firstChild);
  }
}

// Elimina curso del carrito
function deleteCourse(e){
  // usamos delegation para evitar el event bubbling
  if(e.target.classList.contains('borrar-curso')){
    const cursoId = e.target.getAttribute('data-id')

    // eliminar del arreglo
    shoppingCart = shoppingCart.filter( item=> item.id !== cursoId)

    // generar html
    mostrarCarrito()
  }
}

// Limpiar carrito
function cleanShoppingCart(e){
  if(e.target.classList.contains('button')){
    shoppingCart = []
  }
  cleanCartHtml()
}
// <= >= ===
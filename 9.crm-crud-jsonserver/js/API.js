// crear la conexion a la apis
const url = `http://localhost:3000/clientes`;

export const obtenerClientes = async () => {
  try {
    const data = await fetch(url);
    if (!data.ok) return;
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const obtenerCliente = async (id) => {
  try {
    const data = await fetch(`${url}/${id}`);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const nuevoCliente = async (cliente) => {
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(cliente),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};


export const editarCliente =async  (cliente) =>{
  try {
    await fetch(`${url}/${cliente.id}`,{
      method:'PUT',
      body:JSON.stringify(cliente),
      headers:{
        'Content-Type':'application/json'
      }
    })

    window.location.href = 'index.html'

  } catch (error) {
    console.log(error)
  }
}

export const eliminarCliente = async (id) => {
  try {
    await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
  }
};

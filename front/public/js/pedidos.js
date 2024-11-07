document.addEventListener("DOMContentLoaded", () => {
  const tablaPedidos = document.querySelector("#tabla-pedidos tbody");
  const buscarPedidoBtn = document.querySelector("#buscar-pedido-btn");
  const buscarIdInput = document.querySelector("#buscar-id");
  const actualizarPedidoBtn = document.querySelector("#actualizar-pedido-btn");
  const idPedidoUpdateInput = document.querySelector("#id-pedido-update");
  const direccionUpdateInput = document.querySelector("#direccion-update");
  const crearPedidoBtn = document.querySelector("#crear-pedido-btn"); // Nuevo

  // Función para obtener pedidos del backend
  async function obtenerPedidos() {
    try {
      const response = await fetch('https://brc.onrender.com/api/pedido/obtenerpedidos');

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const pedidos = await response.json();
      console.log("Pedidos obtenidos:", pedidos);
      
      mostrarPedidos(pedidos);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      tablaPedidos.innerHTML = `<tr><td colspan="7">Error al cargar pedidos: ${error.message}</td></tr>`;
    }
  }

  // Función para mostrar los pedidos en la tabla
  function mostrarPedidos(pedidos) {
    if (!pedidos || pedidos.length === 0) {
      tablaPedidos.innerHTML = '<tr><td colspan="7">No hay pedidos para mostrar.</td></tr>';
      return;
    }

    const pedidosHTML = pedidos.map(pedido => `
      <tr>
        <td>${pedido.id_pedido}</td>
        <td>${pedido.id_usuario}</td>
        <td>${pedido.id_repostero}</td>
        <td>${pedido.id_pastel}</td>
        <td>${pedido.direccion}</td>
        <td>${new Date(pedido.fecha_entrega).toLocaleString()}</td>
        <td>${new Date(pedido.fecha_pedido).toLocaleString()}</td>
        <td><button class="eliminar-btn" data-id="${pedido.id_pedido}">Eliminar</button></td>
      </tr>
    `).join("");

    tablaPedidos.innerHTML = pedidosHTML;

    // Añadir eventos a los botones de eliminar
    const eliminarBtns = document.querySelectorAll(".eliminar-btn");
    eliminarBtns.forEach(btn => {
      btn.addEventListener("click", (event) => {
        const id = event.target.getAttribute("data-id");
        eliminarPedido(id);
      });
    });
  }

  // Función para eliminar un pedido
  async function eliminarPedido(id) {
    try {
      const response = await fetch(`https://brc.onrender.com/api/pedido/elimpedido/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el pedido: ${response.status}`);
      }

      // Refrescar la lista de pedidos después de eliminar
      obtenerPedidos();
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
    }
  }

  // Función para obtener pedido por ID
  async function obtenerPedidoPorId(id) {
    try {
      const response = await fetch(`https://brc.onrender.com/api/pedido/pedido/${id}`);
      
      if (!response.ok) {
        throw new Error(`Pedido no encontrado: ${response.status}`);
      }

      const pedido = await response.json();
      mostrarPedidos([pedido]); // Mostrar el pedido en la tabla
    } catch (error) {
      console.error("Error al obtener pedido:", error);
      tablaPedidos.innerHTML = `<tr><td colspan="7">Error al cargar pedido: ${error.message}</td></tr>`;
    }
  }

  // Evento de búsqueda por ID
  buscarPedidoBtn.addEventListener("click", () => {
    const id = buscarIdInput.value;
    if (id) {
      obtenerPedidoPorId(id);
    }
  });

  // Función para actualizar un pedido
  async function actualizarPedido(id, data) {
    try {
      const response = await fetch(`https://brc.onrender.com/api/pedido/actpedido/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el pedido: ${response.status}`);
      }

      // Refrescar la lista de pedidos después de actualizar
      obtenerPedidos();
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
    }
  }

  // Evento de actualización de pedido
  actualizarPedidoBtn.addEventListener("click", () => {
    const id = idPedidoUpdateInput.value;
    const direccion = direccionUpdateInput.value;

    if (id && direccion) {
      const data = { direccion }; // Solo estamos actualizando la dirección
      actualizarPedido(id, data);
    }
  });

  // Función para crear un nuevo pedido
  async function crearPedido() {
    const idUsuario = document.getElementById('id-usuario').value;
    const idRepostero = document.getElementById('id-repostero').value;
    const idPastel = document.getElementById('id-pastel').value;
    const direccion = document.getElementById('direccion').value;
    const fechaEntrega = document.getElementById('fecha-entrega').value;
    const fechaPedido = document.getElementById('fecha-pedido').value;

    const data = {
      id_usuario: idUsuario,
      id_repostero: idRepostero,
      id_pastel: idPastel,
      direccion: direccion,
      fecha_entrega: fechaEntrega,
      fecha_pedido: fechaPedido
    };

    try {
      const response = await fetch('https://brc.onrender.com/api/pedido/crearpedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
      alert('Pedido creado exitosamente');
      obtenerPedidos(); // Actualiza la lista de pedidos
    } catch (error) {
      console.error('Error al crear el pedido:', error);
    }
  }

  // Evento de creación de pedido
  crearPedidoBtn.addEventListener('click', crearPedido);

  // Llama a la función original para obtener todos los pedidos al cargar la página
  obtenerPedidos();
});

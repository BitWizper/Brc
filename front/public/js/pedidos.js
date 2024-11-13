document.addEventListener("DOMContentLoaded", () => {
    const tablaPedidos = document.querySelector("#tabla-pedidos tbody");
    const buscarPedidoBtn = document.querySelector("#buscar-pedido-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const crearPedidoBtn = document.querySelector("#crear-pedido-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let pedidos = []; // Almacena todos los pedidos obtenidos
    let currentPage = 1;
    const itemsPerPage = 10;

    // Función para obtener todos los pedidos
    async function obtenerPedidos() {
        try {
            const response = await fetch('https://brc.onrender.com/api/pedido/obtenerpedidos');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);

            pedidos = await response.json();
            renderPage(currentPage); // Mostrar la primera página
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
            tablaPedidos.innerHTML = `<tr><td colspan="8">Error al cargar pedidos: ${error.message}</td></tr>`;
        }
    }

    // Función para mostrar una página específica de pedidos
    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = pedidos.slice(start, end);

        mostrarPedidos(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= pedidos.length;
    }

    // Función para mostrar los pedidos en la tabla
    function mostrarPedidos(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaPedidos.innerHTML = '<tr><td colspan="8">No hay pedidos para mostrar.</td></tr>';
            return;
        }

        const pedidosHTML = pageItems.map(pedido => `
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

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarPedido(id);
            });
        });
    }

    // Funciones de navegación de paginación
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < pedidos.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Función para buscar pedido por ID
    buscarPedidoBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerPedidoPorId(id);
    });

    // Función para eliminar un pedido
    async function eliminarPedido(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pedido/elimpedido/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el pedido: ${response.status}`);
            obtenerPedidos(); // Recargar pedidos después de eliminar
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
        }
    }

    // Función para obtener pedido por ID y mostrarlo en la tabla
    async function obtenerPedidoPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pedido/pedido/${id}`);
            if (!response.ok) throw new Error(`Pedido no encontrado: ${response.status}`);

            const pedido = await response.json();
            mostrarPedidos([pedido]);
        } catch (error) {
            console.error("Error al obtener pedido:", error);
            tablaPedidos.innerHTML = `<tr><td colspan="8">Error al cargar pedido: ${error.message}</td></tr>`;
        }
    }

    // Llamar a la función para obtener todos los pedidos cuando se carga la página
    obtenerPedidos();
});

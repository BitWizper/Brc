document.addEventListener("DOMContentLoaded", () => {
    const tablaPasteles = document.querySelector("#tabla-pasteles tbody");
    const buscarPastelBtn = document.querySelector("#buscar-pastel-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarPastelBtn = document.querySelector("#actualizar-pastel-btn");
    const crearPastelBtn = document.querySelector("#crear-pastel-btn");

    let currentPage = 1;  // Página actual de la paginación
    const pageSize = 500; // Tamaño de página (número de registros por página)

    async function obtenerPasteles(page = 1) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/obtenerpasteles?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            const pasteles = await response.json();
            mostrarPasteles(pasteles.data); // Asegúrate que los datos estén en el objeto `data`
            configurarPaginacion(pasteles.totalPages); // Configurar paginación en base al total de páginas
        } catch (error) {
            console.error("Error al obtener pasteles:", error);
            tablaPasteles.innerHTML = `<tr><td colspan="7">Error al cargar pasteles: ${error.message}</td></tr>`;
        }
    }

    function mostrarPasteles(pasteles) {
        if (!pasteles || pasteles.length === 0) {
            tablaPasteles.innerHTML = '<tr><td colspan="7">No hay pasteles para mostrar.</td></tr>';
            return;
        }

        const pastelesHTML = pasteles.map(pastel => `
            <tr>
                <td>${pastel.id_pastel}</td>
                <td>${pastel.nombre}</td>
                <td>${pastel.descripcion}</td>
                <td>${pastel.precio}</td>
                <td>${pastel.popularidad}</td>
                <td>${pastel.destacado ? 'Sí' : 'No'}</td>
                <td><button class="eliminar-btn" data-id="${pastel.id_pastel}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaPasteles.innerHTML = pastelesHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarPastel(id);
            });
        });
    }

    function configurarPaginacion(totalPages) {
        const paginacionContainer = document.querySelector("#paginacion");
        paginacionContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.innerText = i;
            button.classList.add("paginacion-btn");
            if (i === currentPage) button.classList.add("active");

            button.addEventListener("click", () => {
                currentPage = i;
                obtenerPasteles(currentPage);
            });

            paginacionContainer.appendChild(button);
        }
    }

    async function eliminarPastel(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/elimpasteles/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el pastel: ${response.status}`);
            
            obtenerPasteles(currentPage); 
        } catch (error) {
            console.error("Error al eliminar pastel:", error);
        }
    }

    // Continuación del resto de funciones (obtenerPastelPorId, actualizarPastel, crearPastel) ...

    obtenerPasteles(); // Cargar la primera página al inicio
});


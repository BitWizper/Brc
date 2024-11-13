document.addEventListener("DOMContentLoaded", () => {
    const tablaReposteros = document.querySelector("#tabla-reposteros tbody");
    const buscarReposteroBtn = document.querySelector("#buscar-repostero-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarReposteroBtn = document.querySelector("#actualizar-repostero-btn");
    const idReposteroUpdateInput = document.querySelector("#id-repostero-update");
    const nombreUpdateInput = document.querySelector("#nombre-update");
    const especialidadUpdateInput = document.querySelector("#especialidad-update");
    const crearReposteroBtn = document.querySelector("#crear-repostero-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let reposteros = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    async function obtenerReposteros() {
        try {
            const response = await fetch('https://brc.onrender.com/api/repostero/obtenereposteros');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            reposteros = await response.json();
            renderPage(currentPage); // Muestra la primera página
        } catch (error) {
            console.error("Error al obtener reposteros:", error);
            tablaReposteros.innerHTML = `<tr><td colspan="6">Error al cargar reposteros: ${error.message}</td></tr>`;
        }
    }

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = reposteros.slice(start, end);

        mostrarReposteros(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= reposteros.length;
    }

    function mostrarReposteros(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaReposteros.innerHTML = '<tr><td colspan="6">No hay reposteros para mostrar.</td></tr>';
            return;
        }

        const reposterosHTML = pageItems.map(repostero => `
            <tr>
                <td>${repostero.id_repostero}</td>
                <td>${repostero.NombreNegocio}</td>
                <td>${repostero.Ubicacion}</td>
                <td>${repostero.Especialidades}</td>
                <td><a href="${repostero.PortafolioURL}" target="_blank">Ver Portafolio</a></td>
                <td><button class="eliminar-btn" data-id="${repostero.id_repostero}">Eliminar</button></td>
            </tr>
        `).join("");

        tablaReposteros.innerHTML = reposterosHTML;

        document.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                eliminarRepostero(id);
            });
        });
    }

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < reposteros.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    buscarReposteroBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerReposteroPorId(id);
    });

    async function eliminarRepostero(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/repostero/elimreposteros/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el repostero: ${response.status}`);
            
            obtenerReposteros();
        } catch (error) {
            console.error("Error al eliminar repostero:", error);
        }
    }

    async function obtenerReposteroPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/repostero/reposteros/${id}`);
            if (!response.ok) throw new Error(`Repostero no encontrado: ${response.status}`);
            
            const repostero = await response.json();
            mostrarReposteros([repostero]);
        } catch (error) {
            console.error("Error al obtener repostero:", error);
            tablaReposteros.innerHTML = `<tr><td colspan="6">Error al cargar repostero: ${error.message}</td></tr>`;
        }
    }

    async function actualizarRepostero(id, data) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/repostero/actreposteros/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error al actualizar el repostero: ${response.status}`);
            
            obtenerReposteros();
        } catch (error) {
            console.error("Error al actualizar repostero:", error);
        }
    }

    actualizarReposteroBtn.addEventListener("click", () => {
        const id = idReposteroUpdateInput.value;
        const nombre = nombreUpdateInput.value;
        const especialidad = especialidadUpdateInput.value;

        if (id && nombre && especialidad) {
            const data = { NombreNegocio: nombre, Especialidades: especialidad };
            actualizarRepostero(id, data);
        }
    });

    async function crearRepostero() {
        const nombre = document.getElementById('nombre').value;
        const especialidad = document.getElementById('especialidad').value;
        const ubicacion = document.getElementById('ubicacion').value;
        const portafolioURL = document.getElementById('portafolio-url').value;

        const data = {
            NombreNegocio: nombre,
            Ubicacion: ubicacion,
            Especialidades: especialidad,
            PortafolioURL: portafolioURL
        };

        try {
            const response = await fetch('https://brc.onrender.com/api/repostero/creareposteros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            alert('Repostero creado exitosamente');
            obtenerReposteros();
        } catch (error) {
            console.error("Error al crear repostero:", error);
        }
    }

    crearReposteroBtn.addEventListener("click", crearRepostero);
    obtenerReposteros();
});


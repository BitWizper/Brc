document.addEventListener("DOMContentLoaded", () => {
    const tablaPasteles = document.querySelector("#tabla-pasteles tbody");
    const buscarPastelBtn = document.querySelector("#buscar-pastel-btn");
    const buscarIdInput = document.querySelector("#buscar-id");
    const actualizarPastelBtn = document.querySelector("#actualizar-pastel-btn");
    const crearPastelBtn = document.querySelector("#crear-pastel-btn");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    let pasteles = []; // Almacena todos los pasteles obtenidos
    let currentPage = 1;
    const itemsPerPage = 10;

    async function obtenerPasteles() {
        try {
            const response = await fetch('https://brc.onrender.com/api/pastel/obtenerpasteles');
            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            pasteles = await response.json();
            renderPage(currentPage); // Mostrar la primera página
        } catch (error) {
            console.error("Error al obtener pasteles:", error);
            tablaPasteles.innerHTML = `<tr><td colspan="7">Error al cargar pasteles: ${error.message}</td></tr>`;
        }
    }

    function renderPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = pasteles.slice(start, end);

        mostrarPasteles(pageItems);
        pageInfo.textContent = `Página ${page}`;
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = end >= pasteles.length;
    }

    function mostrarPasteles(pageItems) {
        if (!pageItems || pageItems.length === 0) {
            tablaPasteles.innerHTML = '<tr><td colspan="7">No hay pasteles para mostrar.</td></tr>';
            return;
        }

        const pastelesHTML = pageItems.map(pastel => `
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

    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < pasteles.length) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    buscarPastelBtn.addEventListener("click", () => {
        const id = buscarIdInput.value;
        if (id) obtenerPastelPorId(id);
    });

    async function eliminarPastel(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/elimpasteles/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Error al eliminar el pastel: ${response.status}`);
            
            obtenerPasteles(); 
        } catch (error) {
            console.error("Error al eliminar pastel:", error);
        }
    }

    async function obtenerPastelPorId(id) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/pasteles/${id}`);
            if (!response.ok) throw new Error(`Pastel no encontrado: ${response.status}`);
            
            const pastel = await response.json();
            mostrarPasteles([pastel]);
        } catch (error) {
            console.error("Error al obtener pastel:", error);
            tablaPasteles.innerHTML = `<tr><td colspan="7">Error al cargar pastel: ${error.message}</td></tr>`;
        }
    }

    async function actualizarPastel(id, data) {
        try {
            const response = await fetch(`https://brc.onrender.com/api/pastel/actpasteles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error al actualizar el pastel: ${response.status}`);
            
            obtenerPasteles(); 
        } catch (error) {
            console.error("Error al actualizar pastel:", error);
        }
    }

    actualizarPastelBtn.addEventListener("click", () => {
        const id = document.getElementById('id-pastel-update').value;
        const nombre = document.getElementById('nombre-update').value;
        const descripcion = document.getElementById('descripcion-update').value;
        const precio = document.getElementById('precio-update').value;
        const popularidad = document.getElementById('popularidad-update').value;
        const destacado = document.getElementById('destacado-update').checked;

        if (id && nombre && descripcion && precio) {
            const data = { nombre, descripcion, precio, popularidad, destacado };
            actualizarPastel(id, data);
        }
    });

    async function crearPastel() {
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const popularidad = document.getElementById('popularidad').value || 0;
        const destacado = document.getElementById('destacado').checked;

        const data = { nombre, descripcion, precio, popularidad, destacado };

        try {
            const response = await fetch('https://brc.onrender.com/api/pastel/crearpasteles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`Error en la solicitud: ${response.status}`);
            
            alert('Pastel creado exitosamente');
            obtenerPasteles();
        } catch (error) {
            console.error('Error al crear el pastel:', error);
        }
    }

    crearPastelBtn.addEventListener('click', crearPastel);
    
    obtenerPasteles();
});

